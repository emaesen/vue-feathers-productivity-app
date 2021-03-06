<template>
  <div class="cell reminders-list-cell" :class="dueClass">
    <transition name="fade">
      <div
        v-if="showCountDown && !brieflyHideCountDown"
        class="countdown-timer"
        @click.stop="brieflyRevealDueDate"
      >
        <pa-count-down
          v-if="showCountDown"
          :targetDate="reminderDate"
          class="countdown-reminder"
          :class="{'fast': isDueSoon && !hasGraceWindow}"
        />
        <span v-if="showCountDown && hasGraceWindow" class="grace-indicator">ℊ</span>
        <pa-count-down
          v-if="showCountDown && hasGraceWindow"
          :targetDate="dueDateAfterGracePeriod"
          class="countdown-grace"
          :class="{'fast': isDueSoon && isInGraceWindow}"
        />
      </div>
    </transition>
    <div :id="'reminder-'+reminder._id" class="reminder" :class="'clr-' + reminder.color">
      <transition name="fade" mode="out-in" @after-enter="editTransitionComplete">
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
          <div ref="content" :class="dueClass">
            <div class="date-time" :class="dueClass">
              <font-awesome-icon v-if="isRecurring" icon="recycle"/>
              {{ due.date }}{{ due.date && due.time ? ", " : ""}}{{ due.time}}
              <span
                class="ampm"
              >{{ due.ampm }}</span>
            </div>
            <div v-html="textAsHtml" class="task" :class="dueClass"/>
            <div class="action-row" :class="{hidden:isCollapsed}">
              <button class="action button" title="edit" @click="showForm">
                <font-awesome-icon icon="edit"/>edit
              </button>
              
              <button
                v-if="isDismissable"
                class="action button"
                title="dismiss"
                @click="dismissReminder(reminder)"
              >
                <font-awesome-icon :icon="['far','bell-slash']"/>dismiss
              </button>

              <transition name="fade" mode="out-in">
                <button
                  v-if="!isDeleteClicked"
                  class="action button"
                  title="delete"
                  @click="deleteReminder(reminder)"
                >
                  <font-awesome-icon icon="trash-alt"/>delete
                </button>
                <div v-if="isDeleteClicked" class="confirm">
                  Confirm Delete:
                  <button
                    class="action button"
                    title="delete"
                    @click="deleteReminder(reminder, true)"
                  >
                    <font-awesome-icon icon="trash-alt"/>yes!
                  </button>
                  <button
                    class="action button"
                    title="delete"
                    @click="deleteReminder(reminder, false)"
                  >
                    <font-awesome-icon icon="ban"/>no
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <pa-edit-reminder
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
import calendarUtils from "../utils/calendar";
import EditReminder from "./CreateEditReminder";
import CountDown from "./CountDown";
import { mapGetters, mapMutations } from "vuex";

const DUETEXTWINDOWDAYS = 7;

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
    "pa-edit-reminder": EditReminder,
    "pa-count-down": CountDown
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
      isDeleteClicked: false,
      brieflyHideCountDown: false,
      week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ]
    };
  },
  mounted() {
    this.setContentStyleProps();
  },
  computed: {
    ...mapGetters(["timeTick"]),
    textAsHtml() {
      return simpleFormat(this.reminder.text);
    },
    tickTock() {
      return this.timeTick;
    },
    isRecurring() {
      return (
        this.reminder &&
        this.reminder.weekdays &&
        this.reminder.weekdays.length > 0
      );
    },
    isDismissable() {
      return this.isRecurring && this.isPastDue;
    },
    due() {
      //let today = new Date();
      let date = this.reminderDate;
      let time = this.reminder.time.split(":");
      let dateTxt = "";
      let timeTxt = "";
      let ampmTxt = "";
      let dueInNrDays = calendarUtils.dayDiff(date, new Date());
      if (dueInNrDays <= DUETEXTWINDOWDAYS) {
        dateTxt =
          dueInNrDays === 0
            ? "today"
            : dueInNrDays === 1
            ? "tomorrow"
            : dueInNrDays === -1
            ? "yesterday"
            : dueInNrDays < -1
            ? -dueInNrDays + " days ago"
            : "in " + dueInNrDays + " days";
      } else {
        dateTxt =
          this.week[date.getDay()] +
          " " +
          this.month[date.getMonth()] +
          " " +
          date.getDate();
      }
      if (time[1] && (!this.isPastDue || dueInNrDays === 0)) {
        timeTxt =
          (1 * time[0] > 12 ? 1 * time[0] - 12 : 1 * time[0]) + ":" + time[1];
        ampmTxt = 1 * time[0] >= 12 ? "PM" : "AM";
      }
      return {
        date: dateTxt,
        time: timeTxt,
        ampm: ampmTxt
      };
    },
    windowAsString() {
      let str = "";
      if (this.reminder && this.reminder.window) {
        str = this.reminder.window.join("|");
      }
      return str;
    },
    countDownMSecBeforeDue() {
      let window = this.windowAsString && this.reminder && this.reminder.window;
      let minutes = 0;
      if (window[1]) {
        // hours in countdown window - count as minutes
        minutes = minutes + 60 * window[1];
      }
      if (window[2]) {
        // minutes in countdown window
        minutes = minutes + 1 * window[2];
      }
      // convert minutes to msec
      return minutes * 60 * 1000;
    },
    countDownMSecDuringGracePeriod() {
      let window = this.windowAsString && this.reminder && this.reminder.window;
      let minutes = 0;
      if (window[3]) {
        // days in countdown window - count as minutes
        minutes = minutes + 24 * 60 * window[3];
      }
      if (window[4]) {
        // hours in countdown window - count as minutes
        minutes = minutes + 60 * window[4];
      }
      if (window[5]) {
        // minutes in countdown window
        minutes = minutes + 1 * window[5];
      }
      // convert minutes to msec
      return minutes * 60 * 1000;
    },
    dueDateAfterGracePeriod() {
      return (
        this.windowAsString &&
        new Date(
          this.reminderDate.getTime() + this.countDownMSecDuringGracePeriod
        )
      );
    },
    countDownTarget() {
      return this.isNotYetDue ? this.dueDate : this.dueDateAfterGracePeriod;
    },
    reminderDate() {
      if (this.reminder.weekdays && this.reminder.weekdays.length > 0 && calendarUtils.timeDiff(this.reminder.date, new Date()) > 0) {
        // in case this is a recurring reminder, calculate next reminder date
        return calendarUtils.upcomingDate(this.reminder);
      } else {
        return calendarUtils.dateObj(this.reminder);
      }
    },
    dueDate() {
      if (this.isInGraceWindow) {
        return this.dueDateAfterGracePeriod;
      } else {
        return this.reminderDate;
      }
    },
    isNotYetDue() {
      return calendarUtils.timeDiff(this.dueDate, new Date()) > 0;
    },
    isPastDue() {
      return calendarUtils.timeDiff(this.dueDate, new Date()) < 0;
    },
    isDueToday() {
      return calendarUtils.dayDiff(this.dueDate, new Date()) === 0;
    },
    isDueSoon() {
      let timeDiff = calendarUtils.timeDiff(this.dueDate, new Date());
      return timeDiff < this.countDownMSecBeforeDue && timeDiff > 0;
    },
    hasGraceWindow() {
      return this.countDownMSecDuringGracePeriod > 0;
    },
    isInGraceWindow() {
      let timeDiff = calendarUtils.timeDiff(
        this.dueDateAfterGracePeriod,
        new Date()
      );
      return (
        this.tickTock &&
        timeDiff < this.countDownMSecDuringGracePeriod &&
        timeDiff > 0
      );
    },
    dueClass() {
      return (
        this.tickTock &&
        (this.isPastDue
          ? "pastdue"
          : this.isDueSoon
          ? "duesoon"
          : this.isDueToday
          ? "duetoday"
          : "notyetdue")
      );
    },
    showCountDown() {
      return this.isDueSoon || this.isInGraceWindow;
    }
  },
  methods: {
    ...mapMutations([
      "INCREASE_NR_PAST_DUE_REMINDERS",
      "DECREASE_NR_PAST_DUE_REMINDERS"
    ]),
    editTransitionComplete() {
      if (this.resetStyle) {
        this.setContentStyleProps();
        this.resetStyle = false;
      }
    },
    setContentStyleProps() {
      this.$nextTick(function() {
        if (this.$refs && this.$refs.content) {
          let elHeight = this.$refs.content.offsetHeight;
          // set max-height to actual height
          // (to allow for non-delay smooth open/close transition)
          this.maxReminderHeight = elHeight;
          // calculate transition duration such that the transition speed
          // is fairly consistent for various reminder heights. (in seconds)
          this.transitionDuration = 0.3 + elHeight / 500;
        }
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
    dismissReminder(reminder) {
      // perform an update to force a re-evaluation
      // of this.reminderDate and a re-render of the full list of
      // reminders in all open clients
      reminder.dismissedAt = Date.now();
      this.editReminder(reminder);
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
      this.reminder.window = this.origReminder.window;
      this.reminder.weekdays = this.origReminder.weekdays;
      this.reminder.startDate = this.origReminder.startDate;
      this.isEditing = false;
    },
    editReminderWarning(warning) {
      this.$emit("edit-reminder-warning", warning);
    },
    brieflyRevealDueDate() {
      this.brieflyHideCountDown = true;
      setTimeout(() => (this.brieflyHideCountDown = false), 5000);
    }
  },
  watch: {
    isPastDue() {
      if (this.isPastDue) {
        this.INCREASE_NR_PAST_DUE_REMINDERS();
      } else {
        this.DECREASE_NR_PAST_DUE_REMINDERS();
      }
    }
  }
};
</script>

<style scoped>
.reminder {
  border: 1px solid #1e1d21;
  border-left: 0;
  border-right: 0;
  padding: 5px;
  margin-bottom: -1px;
}
.date-time {
  float: right;
  font-style: italic;
  color: #cec0a1;
  font-size: 90%;
  padding: 0 10px;
}
.countdown-timer {
  position: absolute;
  right: 20px;
  padding-left: 10px;
  background-color: inherit;
  min-width: 110px;
  width: auto;
  font-size: 125%;
  text-align: right;
  cursor: pointer;
  z-index: 9;
}
.grace-indicator {
  margin-left: 15px;
  color: #cec0a1;
}
.countdown-grace {
  margin-left: 5px;
}
.task {
  padding: 0 5px;
  border-left: 3px solid #000;
  border-right: 3px solid #000;
}
.notyetdue.task {
  border-color: #018b18;
}
.duetoday.task {
  border-color: #ffd900;
}
.duesoon.task {
  border-color: #ff9100;
}
.pastdue.task {
  border-color: #ff0000;
}
.pastdue.date-time {
  color: #ff0000;
}
.ampm {
  margin-left: 0.3em;
  font-size: 80%;
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
