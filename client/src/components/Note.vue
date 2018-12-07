<template>
  <div class="cell notes-list-cell">
    <div :id="'note-'+note._id" class="note">
      <transition name="fade" mode="out-in" @after-enter="editTransitionComplete">
        <div
          v-if="!isEditing"
          class="actionable trans"
          :class="{collapsed: isCollapsed}"
          @click="toggleCollapse"
          :style="{
          maxHeight: maxNoteHeight + 'px',
          'transition-duration': transitionDuration + 's'
        }"
        >
          <div ref="content">
            <div v-if="note.category" class="category">{{ note.category }}</div>
            <div v-else class="category"/>
            <div class="content-text" :class="'clr-' + note.color" v-html="textAsHtml"/>
            <div class="action-row" :class="{hidden:isCollapsed}">
              <button class="action button" title="edit" @click="showForm">
                <font-awesome-icon icon="edit"/>edit
              </button>

              <transition name="fade" mode="out-in">
                <button
                  v-if="!isDeleteClicked"
                  class="action button"
                  title="delete"
                  @click="deleteNote(note)"
                >
                  <font-awesome-icon icon="trash-alt"/>delete
                </button>
                <div v-if="isDeleteClicked" class="confirm">
                  Confirm Delete:
                  <button
                    class="action button"
                    title="delete"
                    @click="deleteNote(note, true)"
                  >
                    <font-awesome-icon icon="trash-alt"/>yes!
                  </button>
                  <button class="action button" title="delete" @click="deleteNote(note, false)">
                    <font-awesome-icon icon="ban"/>no
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <pa-edit-note
          v-if="isEditing"
          :note="note"
          :categories="categories"
          :contentHeight="maxNoteHeight"
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
      .replace(/\r/, "")
      .replace(/</g, "&lt;")
      .replace(/\n *\* /g, "\n⩺ ")
      .replace(/----+\n/g, "<hr>")
      .replace(/```\n([^`]+)\n```\n/g, "<pre>$1</pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/ {2}-/g, "⋯-")
      .replace(/(⋯?)- (.*)\n/g, "$1⋞$2\n")
      .replace(/^([^⋞]*\n)⋞/gm, "$1⋐\n⋞")
      .replace(/^(⋞.+\n)⋯⋞/gm, "$1⋯⋐\n⋯⋞")
      .replace(/^(⋯⋞.+\n)⋞/gm, "$1⋯⋑\n⋟\n⋞")
      .replace(/^(⋯?⋞.+[^⋟])(\n⋯(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n⋯(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋞.+)\n\n/gm, "$1⋟\n⋑\n\n")
      .replace(/⋯/g, "")
      .replace(/⋞/g, "<li>")
      .replace(/\n*⋟\n*/gm, "</li>")
      .replace(/\n*⋐\n*/gm, '<ul class="checklist">')
      .replace(/⋑\n?/gm, "</ul>")
      .replace(/\[ \]/g, "☐")
      .replace(/\[x\]/g, "☑")
      .replace(/(http[^ \n)]+)/g, '<a href="$1" target="_blank">$1</a>')
      .replace(/\n/g, "<br>")
  );
}

export default {
  name: "Note",
  components: {
    "pa-edit-note": EditNote
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
      resetStyle: false,
      isCollapsed: !!this.initCollapsed && true,
      nrOfCharsWhenCollapsed: 15,
      maxNoteHeight: "100",
      transitionDuration: "1",
      isDeleteClicked: false
    };
  },
  mounted: function() {
    this.setContentStyleProps();
  },
  computed: {
    textAsHtml() {
      return simpleFormat(this.note.text);
    }
  },
  methods: {
    editTransitionComplete() {
      if (this.resetStyle) {
        this.setContentStyleProps();
        this.resetStyle = false;
      }
    },
    setContentStyleProps() {
      this.$nextTick(function() {
        let elHeight = this.$refs.content.offsetHeight;
        // set max-height to actual height
        // (to allow for non-delay smooth open/close transition)
        this.maxNoteHeight = elHeight;
        // calculate transition duration such that the transition speed
        // is fairly consistent for various note heights. (in seconds)
        this.transitionDuration = 0.3 + elHeight / 500;
      });
    },
    toggleCollapse(evt) {
      // Need to use $forceUpdate and $nextTick to ensure classes
      // are set properly in the DOM after a filter action
      this.$forceUpdate();
      this.$nextTick(function() {
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
          // Recalculate the content height after the animation ends.
          // Mostly relevant in grid-view since the note width there
          // increases from a column width to 100% when expanded. Thus the
          // height decreases.
          setTimeout(this.setContentStyleProps, 1000 * this.transitionDuration);
        }
        if (sel) {
          // write selection automically to clipboard if possible
          navigator.clipboard && navigator.clipboard.writeText(sel);
        }
      });
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
      this.resetStyle = true;
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
  padding: 5px;
}
.grid .note {
  min-height: 15rem;
}
.content-text {
  padding: 0 5px;
  border-left: 3px solid #000;
  border-right: 3px solid #000;
}
.grid .content-text {
  border-right: 0;
}
.content-text.clr-red {
  border-color: #f91414;
}
.content-text.clr-blue {
  border-color: #141bf9;
}
.content-text.clr-green {
  border-color: #14f926;
}
.content-text.clr-yellow {
  border-color: #ffea02;
}
.content-text.clr-purple {
  border-color: #c114f9;
}

.note hr {
  border-style: groove;
}
.category {
  float: right;
  font-style: italic;
  color: #cec0a1;
  font-size: 90%;
  padding: 0 10px;
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
  margin-top: 0.5em;
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
</style>
