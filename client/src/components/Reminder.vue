<template>
  <div class="cell reminders-list-cell">
    <div
      :id="'reminder-'+reminder._id"
      class="reminder"
      :class="'clr-' + reminder.color"
    >
      <transition name="fade" mode="out-in"
         @after-enter="editTransitionComplete"
      >
      <div
        v-if="!isEditing"
        class="actionable trans"
        :class="{collapsed: isCollapsed}"
        @click="toggleCollapse"
        :style="{
          maxHeight: maxReminderHeight + 'px',
          'transition-duration': transitionDuration + 's'
        }"
      >
        <div
          ref="content"
        >
          <div
            v-if="reminder.category"
            class="category"
          >
            {{ reminder.category }}
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
                @click="deleteReminder(reminder)"
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
                  @click="deleteReminder(reminder, true)"
                >
                  <font-awesome-icon icon="trash-alt" /> yes!
                </button>
                <button
                  class="action button"
                  title="delete"
                  @click="deleteReminder(reminder, false)"
                >
                  <font-awesome-icon icon="ban" /> no
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <edit-reminder
        v-if="isEditing"
        :reminder="reminder"
        :categories="categories"
        :contentHeight="maxReminderHeight"
        @edit-reminder="editReminder"
        @cancel-edit="cancelEdit"
        @edit-reminder-warning="editReminderWarning"
      />
      </transition>
    </div>
  </div>
</template>

<script>
import EditReminder from "./CreateEditReminder";

// allow limited markdown-inspired formatting
function simpleFormat(inp) {
  return (
    inp &&
    inp
      .replace(/\r/, "")
      .replace(/</g, "&lt;")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<i>$1</i>")
      .replace(/(http.+\b)/g, '<a href="$1" target="_blank">$1</a>')
  );
}

export default {
  name: "Reminder",
  components: {
    EditReminder
  },
  props: {
    reminder: {
      type: Object,
      default: () => {}
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
      maxReminderHeight: "100",
      transitionDuration: "1",
      isDeleteClicked: false
    };
  },
  mounted: function() {
    this.setContentStyleProps();
  },
  computed: {
    textAsHtml() {
      return simpleFormat(this.reminder.text);
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
        this.maxReminderHeight = elHeight;
        // calculate transition duration such that the transition speed
        // is fairly consistent for various reminder heights. (in seconds)
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
          // Mostly relevant in grid-view since the reminder width there
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
    deleteReminder(reminder, isConfirmed) {
      if (typeof isConfirmed === "undefined") {
        // ask for confirmation
        this.isDeleteClicked = true;
      } else {
        this.isDeleteClicked = false;
        if (isConfirmed) {
          this.$emit("delete-reminder", reminder);
        }
      }
    },
    showForm() {
      this.isEditing = true;
      this.origReminder = Object.assign({}, this.reminder);
    },
    editReminder(mod) {
      this.isEditing = false;
      this.$emit("edit-reminder", { reminder: this.reminder, mod: mod });
      this.resetStyle = true;
    },
    cancelEdit() {
      this.reminder.text = this.origReminder.text;
      this.reminder.date = this.origReminder.date;
      this.reminder.time = this.origReminder.time;
      this.isEditing = false;
    },
    editReminderWarning(warning) {
      this.$emit("edit-reminder-warning", warning);
    }
  }
};
</script>

<style scoped>
.reminder {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 0.2rem;
}
.grid .reminder {
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
</style>
