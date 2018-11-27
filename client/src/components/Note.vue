<template>
  <div class="cell">
    <div
      :id="'note-'+note._id"
      class="note"
      :class="'clr-' + note.color"
    >
      <transition name="fade" mode="out-in">
      <div
        v-if="!isEditing"
        class="actionable trans"
        :class="{collapsed: isCollapsed}"
        @click="toggleCollapse"
        :style="{
          maxHeight: maxNoteHeight,
          'transition-duration': transitionDuration
        }"
      >
        <div
          ref="content"
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
            v-html="textAsHtml"
          />
          <div class="action-row"
            :class="{hidden:isCollapsed}"
          >
            <button
              class="action button"
              title="edit"
              @click="showForm"
            >
              <font-awesome-icon icon="edit" /> edit
            </button>

            <transition name="fade" mode="out-in">
              <button
                v-if="!isDeleteClicked"
                class="action button"
                title="delete"
                @click="deleteNote(note)"
              >
                <font-awesome-icon icon="trash-alt" /> delete
              </button>
              <div
                v-if="isDeleteClicked"
                class="confirm"
              >
                Confirm Delete:
                <button
                  class="action button"
                  title="delete"
                  @click="deleteNote(note, true)"
                >
                  <font-awesome-icon icon="trash-alt" /> yes!
                </button>
                <button
                  class="action button"
                  title="delete"
                  @click="deleteNote(note, false)"
                >
                  <font-awesome-icon icon="ban" /> no
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <edit-note
        v-if="isEditing"
        :note="note"
        :categories="categories"
        @edit-note="editNote"
        @cancel-edit="cancelEdit"
        @edit-note-warning="editNoteWarning"
      />
      </transition>
    </div>
  </div>
</template>

<script>
import EditNote from "./CreateEditNote";

// allow limited markdown-inspired formatting
function simpleFormat(inp) {
  return (
    inp &&
    inp
      .replace(/</g, "&lt;")
      .replace(/\n *\* /g, "\n⊛ ")
      .replace(/```\n([^`]+)\n```\n/g, "<pre>$1</pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/(http.+\b)/g, '<a href="$1" target="_blank">$1</a>')
      .replace(/\n/g, "<br>")
  );
}

export default {
  name: "Note",
  components: {
    EditNote
  },
  props: {
    note: {
      type: Object,
      default: function() {
        return {
          text: "",
          category: "",
          color: ""
        };
      }
    },
    categories: {
      type: Array
    },
    initCollapsed: {
      type: Boolean,
      default: true
    },
    isPlacedInGrid: {
      type: Boolean
    }
  },
  data() {
    return {
      isEditing: false,
      isCollapsed: !!this.initCollapsed && true,
      nrOfCharsWhenCollapsed: 15,
      maxNoteHeight: "10px",
      transitionDuration: "1s",
      isDeleteClicked: false
    };
  },
  mounted: function() {
    this.setStyleProps();
  },
  computed: {
    textAsHtml() {
      return simpleFormat(this.note.text);
    }
  },
  methods: {
    setStyleProps() {
      this.$nextTick(function() {
        let elHeight = this.$refs.content.offsetHeight;
        // set max-height to actual height
        // (to allow for non-delay smooth open/close transition)
        this.maxNoteHeight = elHeight + "px";
        // calculate transition duration such that the transition speed
        // is fairly consistent for various note heights.
        this.transitionDuration = 0.3 + elHeight / 500 + "s";
      });
    },
    toggleCollapse(evt) {
      let elName = evt.target.localName;
      let sel = window.getSelection && window.getSelection().toString();
      let cell = this.$el;
      // collapse, unless user clicked a link, a button or made a selection
      if (elName !== "a" && elName !== "button" && !sel) {
        this.isCollapsed = !this.isCollapsed;
        if (this.isCollapsed) {
          cell.classList.remove("expanded");
        } else {
          cell.classList.add("expanded");
        }
      }
      if (sel) {
        // write selection automically to clipboard if possible
        navigator.clipboard && navigator.clipboard.writeText(sel);
      }
    },
    deleteNote(note, isConfirmed) {
      if (typeof isConfirmed === "undefined") {
        // ask for confirmation
        this.isDeleteClicked = true;
      } else {
        this.isDeleteClicked = false;
        if (isConfirmed) {
          this.$emit("delete-note", note);
        }
      }
    },
    showForm() {
      this.isEditing = true;
      this.origNote = Object.assign({}, this.note);
    },
    editNote(mod) {
      this.isEditing = false;
      this.$emit("edit-note", { note: this.note, mod: mod });
      this.setStyleProps();
    },
    cancelEdit() {
      this.note.text = this.origNote.text;
      this.note.category = this.origNote.category;
      this.isEditing = false;
    },
    editNoteWarning(warning) {
      this.$emit("edit-note-warning", warning);
    }
  }
};
</script>

<style scoped>
.note {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 0.2rem;
}
.grid .note {
  margin: 0.2rem;
  min-height: 15rem;
}
.category {
  float: right;
  font-style: italic;
  color: #cec0a1;
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
  max-height: 1.1em !important;
}
.show-overflow {
  overflow: auto;
}
.action-row {
  display: inline-block;
  background-color: #8a8a8a63;
  border: 1px solid #212027a3;
  border-radius: 10px;
  margin-top: 0.5em;
  padding: 0.2em 0.5em;
}
.confirm {
  margin-left: 1em;
  display: inline-block;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  opacity: 1;
  transform: scaleY(1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
.animate-transition-transform {
  transition: transform 0.3s;
}
.animate-transition-width {
  transition: width 0.6s ease-in-out;
}
</style>
