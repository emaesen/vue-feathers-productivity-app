<template>
  <section>
    <h2><font-awesome-icon icon="sticky-note" /> Notes</h2>
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
      sortDateCreatedAsc: false,
      sortNoCatLast: true
    }
  },
  created: function() {
    // Find all notes. We'll use the getters to separate them.
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
    sortByDateCreated(a,b) {
      let dateDiff = new Date(b.createdAt) - new Date(a.createdAt)
      return this.sortDateCreatedAsc? -dateDiff : dateDiff;
    },
    uiSort(a,b) {
      // TODO: implement sort selector
      let dir = this.sortAsc? 1 : -1;
      return !a.category ? this.sortNoCatLast? 1 : -1
      : !b.category ? this.sortNoCatLast? -1 : 1
      : b.category < a.category ? 1*dir
      : b.category > a.category ? -1*dir
      : 0;
    },
    uiFilter(note) {
      // TODO: implement category selector
      return true; //note.category==="test";
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
      // But for the Notes service, best is to filter on the client.
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
          .sort(this.sortByDateCreated)
          .sort(this.uiSort)
        : [];
    }
  }
};
</script>

<style>
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
