<template>
  <div>
    <h2>Notes</h2>
    <div v-if="loading" class="loading">
      loading...
    </div>
    <div v-if="!loading">
      <div
        v-for="note in notes"
        :key="note._id"
      >
        <div class="note">
          <div class="category">
            category: {{ note.category }}
          </div>
          <div class="text">
            text: {{ note.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Notes',
  components: {
  },
  created: function() {
    this.findNotes({ query: {} });
  },
  methods: {
    ...mapActions('notes', { findNotes: 'find' } )
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
      // TODO: it should not be necessary to define ownerId in the query!
      // The 'before' hooks in notes.hooks.js should guarantee that only
      // the current user's notes are returned.
      // This works properly on initial pageload, but when switching between
      // logged in users, the notes from the previously logged in user are
      // still accessible!!!
      let query = {
        ownerId: this.user.userId
      };
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
.note {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.category {
  text-align: right;
}
</style>
