<template>
  <section>
    <h2>Notes</h2>
    <create-note
      @create-note="createNote"
      @create-note-warning="createNoteWarning"
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
import Note from './Note';
import CreateNote from './CreateEditNote';

// Get notes as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html#Reactive-Lists-with-Live-Queries
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Notes',
  components: {
    Note,
    CreateNote
  },
  props: {
  },
  created: function() {
    // Find all notes. We'll use the getters to separate them.
    this.findNotes({ query: {} });
  },
  methods: {
    ...mapActions('notes', { findNotes: 'find' } ),
    createNote(newNote) {
      console.log("Create note ", newNote);
      // TODO! create the note
      // create note instance
      const { Note } = this.$FeathersVuex;
      const note = new Note(newNote);
      note.save()
        .then((note) => {
          console.log("Note created ", note);
        });

    },
    deleteNote(note) {
      console.log("Delete note ", note);
      //TODO! delete the note
    },
    editNote(props) {
      console.log("Edit note ", props);
      //save the modifictions
      props.note.text = props.mod.text;
      props.note.category = props.mod.category;
      props.note.update().then((note) => {
        console.log("edit succesful", note);
      })
    },
    createNoteWarning(warning) {
      // TODO! show warning.title, warning.text
      console.log("create warning", warning);
    },
    editNoteWarning(warning) {
      // TODO! show warning.title, warning.text
      console.log("edit warning", warning);
    }
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapState('notes', {
      loading: 'isFindPending',
      creating: 'isCreatePending',
    }),
    ...mapGetters('notes', { findNotesInStore: 'find' }),
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
        query.category = this.category
      }
      return query;
    },
    notes() {
      return this.user ? this.findNotesInStore({
        query: this.query
      }).data : [];
    }
  }
};
</script>

<style scoped>

</style>
