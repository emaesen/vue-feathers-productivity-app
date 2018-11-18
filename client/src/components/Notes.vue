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
      // TODO: implement category selector
      // Return null if no category is selected so that all are returned.
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
