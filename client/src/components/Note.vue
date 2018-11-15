<template>
  <div
    :id="'note-'+note._id"
    class="note"
  >
    <div
      v-if="!isEditing"
      class=""
    >
      <div
        class="actionable trans"
        :class="{collapsed: isCollapsed}"
        @click="toggleCollapse"
        :style="{
          maxHeight: maxNoteHeight,
          'transition-duration': transitionDuration
        }"
      >
        <div
          :id="'note-'+note._id+'-content'"
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
    </div>
    <edit-note
      v-if="isEditing"
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
    .replace(/\n *\* /g, "\n⊛ ")
    .replace(/```\n([^`]+)\n```\n/g, '<pre>$1</pre>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
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
      nrOfCharsWhenCollapsed: 15,
      maxNoteHeight: '10px',
      transitionDuration: '1s'
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      let elHeight = document.getElementById('note-'+this.note._id +'-content').offsetHeight;
      // set max-height to actual height
      // (to allow for non-delay smooth open/close transition)
      this.maxNoteHeight = elHeight + 'px';
      // calculate transition duration such that the transition speed
      // is fairly consistent for various note heights.
      this.transitionDuration = (.3 + elHeight/500) + 's';
    })
  },
  computed: {
    textAsHtml() {
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
.trans {
  /* use max-height to transition the height */
  /* the duration is calculated and set as inline style */
  transition: max-height 1s ease-out;
  /* set fall-back max-height here*/
  /* accurate max-height is set as inline style on the element */
  max-height: 50em;
  overflow: hidden;
}
.collapsed {
  /* must use !important to override inline style */
  max-height: 1.1em!important;
}
.show-overflow {
  overflow: auto;
}
</style>
