<template>
  <section>
    <span
      class="icon action float right"
    >
      ⊕
    </span>
    <h2>Notes</h2>
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

// Get notes as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html#Reactive-Lists-with-Live-Queries
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Notes',
  components: {
    Note
  },
  props: {
  },
  created: function() {
    // Find all notes. We'll use the getters to separate them.
    this.findNotes({ query: {} });
  },
  methods: {
    ...mapActions('notes', { findNotes: 'find' } ),
    deleteNote(note) {
      console.log("Delete note ", note);
      //delete the note
    },
    editNote(props) {
      console.log("Edit note ", props);
      //save the modifictions
      props.note.text = props.mod.text;
      props.note.category = props.mod.category;
      props.note.save().then((note) => {
        console.log("edit succesful", note);
      })
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
