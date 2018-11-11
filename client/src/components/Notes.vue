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
// Get notes as "Reactive Lists with Live Queries"
// https://feathers-plus.github.io/v1/feathers-vuex/common-patterns.html#Reactive-Lists-with-Live-Queries
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Notes',
  components: {
  },
  created: function() {
    // Find all notes. We'll use the getters to separate them.
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
