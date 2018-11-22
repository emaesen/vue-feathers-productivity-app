<template>
  <section id="notes">
    <h2 class="notes"><font-awesome-icon icon="sticky-note" /> Notes</h2>
    <div class="controls">
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
        @click="setFilter"
        class="action button"
      >
        <font-awesome-icon icon="filter" />
        {{ filterType }}
      </button>
    </div>
    <create-note
      @create-note="createNote"
    />
    <div v-if="loading" class="loading">
      loading...
    </div>
    <div v-if="!loading">
      <note
        v-for="note in notes"
        :note="note"
        :key="note._id"
        @delete-note="deleteNote"
        @edit-note="editNote"
      />
    </div>
  </section>
</template>

<script>
import Note from "./Note";
import CreateNote from "./CreateEditNote";

// Get notes as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html#Reactive-Lists-with-Live-Queries
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "Notes",
  components: {
    Note,
    CreateNote
  },
  props: {},
  data() {
    return {
      sortAsc: true,
      colors: ['red', 'yellow', 'purple', 'blue', 'green', ''],
      types: ['color', 'category', 'date created', 'date modified'],
      sortType: 'color',
      filterType: '',
      filter: '',
      sortDateAsc: false,
      sortNoCatLast: true
    }
  },
  created: function() {
    // Find all notes from server. We'll filter/sort on the client.
    this.findNotes({ query: {} });
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
      });
    },
    deleteNote(note) {
      console.log("Delete note ", note);
      // delete the note
      note.remove().then(() => {
        console.log("remove succesful");
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
    setFilter() {
      let result;
      // TODO!
      this.categories;
      return result;
    },
    uiFilter(note) {
      let result = true;
      if (this.filterType && this.filter) {
        result = note[this.filterType] === this.filter;
      }
      return result;
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
      return this.user
        ? this.findNotesInStore({
            query: this.query
          }).data
          .filter(this.uiFilter)
          .sort(this.sortByDate)
          .sort(this.uiSort)
        : [];
    },
    categories() {
      // get list of user-defined categories and remove duplicates
      let result = this.notes
        .map(n => n.category)
        .filter((c,i,s) => c!=='' && s.indexOf(c) === i);
      console.log({categories: result})
      return result;
    }
  }
};
</script>

<style>
h2.notes {
  display: inline-block;
  margin-right: 1em;
}
#notes .controls {
  cursor: pointer;
  display: inline-block;
  position: relative;
  top: -5px;
}
.clr-red {
  background-color: #f9141418;
}
.clr-blue {
  background-color: #141bf918;
}
.clr-green {
  background-color: #14f92618;
}
.clr-yellow {
  background-color: #f9e71418;
}
.clr-purple {
  background-color: #c114f918;
}
</style>
