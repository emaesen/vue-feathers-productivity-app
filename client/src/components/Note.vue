<template>
  <div
    :id="'note-'+note._id"
    class="note"
  >
    <div
      v-show="!isEditing"
      class=""
    >
      <div
        class="actionable"
        :class="{collapsed: isCollapsed}"
        @click="toggleCollapse"
      >
        <div
          v-if="note.category"
          class="category"
        >
          {{ note.category }}
        </div>
        <div
          v-else
          class="category"
        />
        <div
          class=""
          v-html="textAsHtml"
        />
        <div class="">
          <span
            class="action button"
            title="edit"
            @click="showForm"
          >
            <span class="icon">✎</span> edit
          </span>

          <span
            class="action button"
            title="delete"
            @click="deleteNote(note)"
          >
            <span class="icon">⊗</span> delete
          </span>
        </div>
      </div>
    </div>
    <edit-note
      v-show="isEditing"
      :note="note"
      @edit-note="editNote"
      @cancel-edit="cancelEdit"
      @edit-note-warning="editNoteWarning"
    />
  </div>
</template>

<script>
import EditNote from './CreateEditNote';

// allow limited markdown-inspired formatting
function simpleFormat(inp){
  return inp && inp
    .replace(/</g, "&lt;")
    .replace(/\* /g, "⊛ ")
    .replace(/```\n([^`]+)\n```\n/g, '<pre>$1</pre>')
    .replace(/(http.+\b)/g, '<a href="$1" target="_blank">$1</a>')
    .replace(/\n/g, "<br>");
}


export default {
  name: 'Note',
  components: {
    EditNote
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    note: {
      type: Object,
      default: function() {
        return {
          text:"",
          category:""
        }
      }
    },
    initCollapsed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isEditing: false,
      isCollapsed: !!this.initCollapsed && true,
      nrOfCharsWhenCollapsed: 15
    };
  },
  computed: {
    textAsHtml: function() {
      return simpleFormat(this.note.text);
    }
  },
  methods: {
    toggleCollapse(evt) {
      let sel = window.getSelection && window.getSelection().toString();
      // collapse, unless user clicked a link or made a selection
      if (evt.target.localName!=='a' && !sel) {
        this.isCollapsed = !this.isCollapsed;
      }
      if (sel) {
        // write selection automically to clipboard if possible
        navigator.clipboard && navigator.clipboard.writeText(sel);
      }
    },
    deleteNote(note) {
      this.$emit('delete-note', note);
    },
    showForm() {
      this.isEditing = true;
      this.origNote = Object.assign({}, this.note);
    },
    editNote(mod) {
      this.isEditing = false;
      this.$emit('edit-note', {note:this.note, mod:mod});
    },
    cancelEdit() {
      this.note.text = this.origNote.text;
      this.note.category = this.origNote.category;
      this.isEditing = false;
    },
    editNoteWarning(warning) {
      this.$emit('edit-note-warning', warning);
    }
  }};
</script>

<style scoped>
.note {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.category {
  float: right;
}
.icon {
  vertical-align: middle;
}
.icon.large {
  font-size: 2rem;
}
.collapsed {
  height: 1em;
  overflow: hidden;
}
</style>
