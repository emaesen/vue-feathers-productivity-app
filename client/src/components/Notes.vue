<template>
  <section id="notes">
    <h2 class="notes"><font-awesome-icon icon="sticky-note" /> Notes</h2>
    <div class="controls convert-to-block-on-small-device">
      <button
        @click="displayGrid=!displayGrid"
        class="action button"
      >
        <font-awesome-icon :icon="displayGrid? 'align-justify' : 'th'" />
      </button>
      <button
        v-if="sortType==='color' || sortType==='category'"
        @click="sortAsc = !sortAsc"
        class="action button"
      >
        sort
        <font-awesome-icon :icon="sortAsc? 'sort-amount-down' : 'sort-amount-up'" />
      </button>
      <button
        v-else
        @click="sortDateAsc = !sortDateAsc"
        class="action button"
      >
        sort
        <font-awesome-icon :icon="sortDateAsc? 'sort-amount-down' : 'sort-amount-up'" />
      </button>
      <button
        @click="cycleSortType"
        class="action button"
      >
        ➔ by
        {{ sortType }}
        <font-awesome-icon icon="check" />
      </button>
      <button
        @click="toggleFilters"
        class="action button"
      >
        {{ showFilters? 'hide' : 'show' }} filters
        <font-awesome-icon icon="filter" />
        ({{ nrFiltersApplied }})
      </button>
    </div>
    <filter-control
      v-show="showFilters"
      :colors="colors"
      :categories="categories"
      :filter="filter"
      :filterMeta="notesFilterMeta"
    />
    <create-note
      @create-note="createNote"
      :categories="categories"
    />
    <div v-if="loading" class="loading">
      loading...
    </div>
    <transition-group
      v-if="!loading"
      tag="div"
      name="notes-list"
      :class="{grid : displayGrid, 'grid-list' : !displayGrid}"
    >
      <note
        v-for="note in notes"
        :note="note"
        :key="note._id"
        :categories="categories"
        :isPlacedInGrid="displayGrid"
        @delete-note="deleteNote"
        @edit-note="editNote"
      />
    </transition-group>
  </section>
</template>

<script>
import Note from "./Note";
import CreateNote from "./CreateEditNote";
import FilterControl from './FilterControl';

// Get notes as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html#Reactive-Lists-with-Live-Queries
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Notes",
  components: {
    Note,
    CreateNote,
    FilterControl
  },
  props: {
    onDashboard: false
  },
  data() {
    return {
      sortAsc: true,
      colors: ['red', 'yellow', 'purple', 'blue', 'green', ''],
      categories: [],
      types: ['color', 'category', 'date created', 'date modified'],
      sortType: 'category',
      filter: {colors:[], categories:[]},
      showFilters: false,
      sortDateAsc: false,
      sortNoCatLast: true,
      displayGrid: !this.onDashboard
    }
  },
  created() {
    // Find all notes from server. We'll filter/sort on the client.
    this.findNotes({ query: {} }).then(this.setCategories);
  },
  methods: {
    ...mapActions("notes", { findNotes: "find" }),
    createNote(newNote) {
      console.log("Create note ", newNote);
      // create note instance
      const { Note } = this.$FeathersVuex;
      const note = new Note(newNote);
      note.save().then(note => {
        console.log("Note created ", note);
        this.setCategories();
      });
    },
    deleteNote(note) {
      console.log("Delete note ", note);
      // delete the note
      note.remove().then(() => {
        console.log("remove succesful");
        this.setCategories();
      });
    },
    editNote(props) {
      console.log("Edit note ", props);
      // save the modifictions
      props.note.text = props.mod.text;
      props.note.category = props.mod.category;
      props.note.color = props.mod.color;
      props.note.update().then(note => {
        console.log("edit succesful", note);
        this.setCategories();
      });
    },
    cycleSortType() {
      let typeIndex = this.types.findIndex(t => t === this.sortType) + 1;
      if (typeIndex >= this.types.length) {
        typeIndex = 0;
      }
      this.sortType = this.types[typeIndex];
      console.log(this.sortType + ' ' + typeIndex);
    },
    sortByDate(a,b, type) {
      type = type || 'updated';
      let dateDiff
      dateDiff = (type === 'updated') ? 
        new Date(b.updatedAt) - new Date(a.updatedAt) 
        : new Date(b.createdAt) - new Date(a.createdAt);
      return this.sortDateAsc? -dateDiff : dateDiff;
    },
    uiSort(a,b) {
      // TODO: implement sort selector
      let dir = this.sortAsc? 1 : -1;
      const colorIndex = clr => this.colors.findIndex(c => c === clr);
      let result;
      switch (this.sortType) {
        case 'color':
        result = colorIndex(b.color) < colorIndex(a.color) ? 1*dir
          : colorIndex(b.color) > colorIndex(a.color) ? -1*dir
          : 0;
          break;
        case 'category':
          result = !a.category ? this.sortNoCatLast? 1 : -1
          : !b.category ? this.sortNoCatLast? -1 : 1
          : b.category < a.category ? 1*dir
          : b.category > a.category ? -1*dir
          : 0;
          break;
        case 'date created':
          result = this.sortByDate(a,b, 'created');
          break;
        case 'date modified':
          result = this.sortByDate(a,b);
          break;
      }
      return result;
    },
    toggleFilters(evt) {
      evt.target.blur();
      this.showFilters = !this.showFilters;
    },
    uiFilter(note) {
      // Filter by selected colors and categories.
      // Multiple colors are `or`-ed. Multiple categories are `or`-ed.
      // Example:
      // (note.color === 'green' || note.color === 'blue') && (note.category === 'code')
      const clrReducer = (acc,cur) => (acc || note.color === cur);
      const catReducer = (acc,cur) => (acc || note.category === cur);
      const hasClr = this.filter.colors.length > 0;
      const hasCat = this.filter.categories.length > 0;
      return this.filter.colors.reduce(clrReducer, !hasClr) 
          && this.filter.categories.reduce(catReducer, !hasCat);
    },
    setCategories() {
      // get list of user-defined categories and remove duplicates
      this.categories = this.notesUnfiltered
        .map(n => n.category)
        .filter((c,i,s) => s.indexOf(c) === i)
        .sort();
      console.log({categories: this.categories});
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapState("notes", {
      loading: "isFindPending",
      creating: "isCreatePending"
    }),
    ...mapGetters("notes", { findNotesInStore: "find" }),
    category() {
      // For large datasets, an option is to implement a query-selector.
      // But for the Notes service, we can just filter on the client.
      return null;
    },
    query() {
      // it is not necessary to define ownerId in the query:
      // The 'before' hooks in notes.hooks.js guarantee that only
      // the current user's notes are returned.
      // In combination with notes service clearAll on logout
      let query = {};
      if (this.category) {
        query.category = this.category;
      }
      return query;
    },
    notes() {
      return this.notesUnfiltered
          .filter(this.uiFilter)
          .sort(this.sortByDate)
          .sort(this.uiSort);
    },
    notesUnfiltered() {
      return this.user
        ? this.findNotesInStore({
            query: this.query
          }).data
        : [];
    },
    nrFiltersApplied() {
      return this.filter.colors.length + this.filter.categories.length;
    },
    notesFilterMeta() {
      return this.notesUnfiltered.map(n => ({color:n.color, category:n.category}));
    }
  }
};
</script>

<style>
h2.notes {
  display: inline-block;
  margin-right: 1em;
  vertical-align: top;
}
#notes .controls {
  cursor: pointer;
  display: inline-block;
  position: relative;
  top: -5px;
}
.grid {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  margin: 0 -0.2rem;
}
*,
*::after,
*::before {
  box-sizing: inherit;
}
.grid-list .cell {
  width: 100%;
}
.grid .cell {
  width: 33.333%;
  display: inline-block;
}
.grid .cell.expanded {
  width: 100%;
}
.grid .collapsed {
  overflow: auto;
  max-height: 15rem !important;
}
.grid pre {
  white-space: pre-wrap;
}
.notes-list-cell {
  transition: all 1s;
}
.notes-list-enter,
.notes-list-leave-to {
  opacity: 0;
  transform: translate(0, -100px);
}
.notes-list-leave-active {
  position: absolute;
}
.clr {
  cursor: pointer;
  display: inline-block;
  border: 1px solid #555;
  border-radius: 10px;
  margin: 0 5px;
  vertical-align: middle;
  width: 25px;
  height: 25px;
}
.clr-red {
  background-color: #f9141436;
}
.clr-blue {
  background-color: #141bf936;
}
.clr-green {
  background-color: #14f92627;
}
.clr-yellow {
  background-color: #ffea0245;
}
.clr-purple {
  background-color: #c114f936;
}
@media all and (max-width: 400px) {
  .grid .cell {
    width: 100%;
  }
}
@media all and (min-width: 400px) {
  .grid .cell {
    width: 50%;
  }
}
@media all and (min-width: 800px) {
  .grid .cell {
    width: 33.333%;
  }
}
@media all and (min-width: 1200px) {
  .grid .cell {
    width: 25%;
  }
}
@media all and (min-width: 1600px) {
  .grid .cell {
    width: 16.666%;
  }
}
</style>
