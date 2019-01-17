<template>
  <div :class="[{form: showForm}, {border: showForm && !isEdit}]">
    <transition name="fade">
      <button
        v-if="!showForm && !isEdit"
        class="action button absolute top right spaced"
        @click="openReminderForm"
      >
        <font-awesome-icon icon="plus-circle"/>add reminder
      </button>
    </transition>
    <transition name="slidefade">
      <div v-if="showForm" class>
        <div class>
          <div class>
            <label for="text">
              Task or event description
              <span v-if="!showError && !isValid" class="req">(required)</span>
              <span v-if="showError" class="error">Please provide a description</span>
            </label>
            <input
              id="description"
              name="description"
              type="text"
              maxlength="108"
              v-model="text"
              placeholder="I need to ..."
              required
            >
          </div>

          <div class>
            <label for="date">
              Due date &amp; time
              <span v-if="!showError && !isValid" class="req">(required)</span>
              <span v-if="showError" class="error">Please provide a due date</span>
            </label>
            <input
              id="date"
              name="date"
              v-model="date"
              type="date"
              placeholder="yyyy-mm-dd"
              min="new Date()"
            >
            <input id="time" name="time" v-model="time" type="time" placeholder="hh:mm" step="300">
          </div>
          <div class="group three">
            <div class="cell">
              <!-- Time period to show the reminder
              *before* the due date-->
              <label for="previewWindowDays">Preview window (d)
                <font-awesome-icon
                  icon="question-circle"
                  class="hover-info-action"
                  @click="revealInfo"
                />
              </label>
              <div class="hover-info">
                Time period (days) to show the reminder on the Dashboard
                <i>before</i> the due date.
                <br>If left empty, the reminder will show only on the due day itself.
              </div>
              <input
                id="previewWindowDays"
                name="previewWindowDays"
                v-model="window[0]"
                type="number"
                placeholder="days"
                min="0"
              >
            </div>
            <div class="cell">
              <!-- Time period to show a count-down alert
              *before* the due time-->
              <label for="alertWindowHours">Count-down window (h,m)
                <font-awesome-icon
                  icon="question-circle"
                  class="hover-info-action"
                  @click="revealInfo"
                />
              </label>
              <div class="hover-info">
                Time period (hours, minutes) to show a count-down
                <i>before</i> the due time.
                <br>If left empty, a 30-minute countdown will be shown.
              </div>
              <input
                id="alertWindowHours"
                name="alertWindowHours"
                v-model="window[1]"
                type="number"
                placeholder="hours"
                min="0"
                max="23"
              >
              <input
                id="alertWindowMinutes"
                name="alertWindowMinutes"
                v-model="window[2]"
                type="number"
                placeholder="minutes"
                min="0"
                max="59"
                step="5"
              >
            </div>
            <div class="cell">
              <!-- Time period to keep showing the reminder (plus time elapsed)
              *after* the due time-->
              <label for="graceWindowDays">Grace/Snooze window (d,h,m)
                <font-awesome-icon
                  icon="question-circle"
                  class="hover-info-action"
                  @click="revealInfo"
                />
              </label>
              <div class="hover-info">
                Grace period (days, hours, minutes)
                <i>after</i> the due date-time;
                only after this grace period is the reminder considered past-due.
                <br>If left empty, the reminder is considered past-due
                once the reminder's date-time is past.
              </div>
              <input
                id="graceWindowDays"
                name="graceWindowDays"
                v-model="window[3]"
                type="number"
                placeholder="days"
                min="0"
              >
              <input
                id="graceWindowHours"
                name="graceWindowHours"
                v-model="window[4]"
                type="number"
                placeholder="hours"
                min="0"
                max="23"
              >
              <input
                id="graceWindowMinutes"
                name="graceWindowMinutes"
                v-model="window[5]"
                type="number"
                placeholder="minutes"
                min="0"
                max="59"
                step="15"
              >
            </div>
          </div>
          <div class="group">
            <div class="cell">
              <label>
                Repeat every week
                <span
                  v-if="!showError && !isValid"
                  class="req"
                >(select none or day(s) + date)</span>
                <span
                  v-if="showError"
                  class="error"
                >Please select one or more days, and a start date</span>
              </label>
              <span class="expl">└ on ➔</span>
              <div class="weekday" v-for="(day, index) in week" :key="'rem'+day">
                <input type="checkbox" :id="'rem'+day" :value="index" v-model="weekdays">
                <label :for="'rem'+day" class="action button checkbox">
                  <span class="day" :class="day">{{ day }}</span>
                </label>
              </div>
              <div class="inline-block nowrap">
                <span class="divider-word">starting on</span>
                <input
                  id="start-date"
                  name="start-date"
                  v-model="startDate"
                  type="date"
                  placeholder="yyyy-mm-dd"
                  min="new Date()"
                >
              </div>
            </div>
          </div>
          <div class>
            <button class="action button" @click="save" :disabled="!isValid">
              <font-awesome-icon icon="check-circle"/>save
            </button>
            <button class="action button" @click="cancel">
              <font-awesome-icon icon="ban"/>cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "CreateEditReminder",
  props: {
    reminder: {
      type: Object,
      default() {
        return {};
      }
    },
    categories: {
      type: Array
    },
    contentHeight: {
      type: Number
    }
  },
  data() {
    return {
      text: (this.reminder && this.reminder.text) || "",
      date: (this.reminder && this.reminder.date) || "",
      time: (this.reminder && this.reminder.time) || "",
      window: (this.reminder && this.reminder.window) || [
        null,
        null,
        null,
        null,
        null,
        null
      ],
      weekdays: (this.reminder && this.reminder.weekdays) || [],
      startDate: (this.reminder && this.reminder.startDate) || "",
      showForm: !!(this.reminder && this.reminder.text),
      showError: false,
      colors: ["", "red", "blue", "green", "yellow", "purple"],
      week: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    };
  },
  computed: {
    isEdit() {
      return !!(this.reminder && this.reminder.text);
    },
    isValid() {
      // cover basic isValid conditions
      const hasText = !!(this.text && this.text !== "");
      const hasDueDate = !!(this.date && this.date !== "");
      const hasDueTime = !!(this.time && this.time !== "");
      const hasStartDate = !!(this.startDate && this.startDate !== "");
      const isRecurring = this.weekdays.length > 0;
      const recurringStartDateIsBeforeDueDate =
        new Date(this.startDate + "T00:00:00") <
        new Date(this.date + "T00:00:00");
      const hasConflict =
        (hasDueDate && hasStartDate && !isRecurring) ||
        (isRecurring && !recurringStartDateIsBeforeDueDate) ||
        (isRecurring && !hasStartDate) ||
        (isRecurring && !hasDueTime);
      return hasText && hasDueDate && !hasConflict;
    },
    textAreaHeight() {
      const minHeight = 150;
      return this.contentHeight > minHeight ? this.contentHeight : minHeight;
    }
  },
  methods: {
    openReminderForm() {
      this.showForm = true;
      this.showError = false;
    },
    selectClr(clr) {
      this.color = clr;
    },
    cancel() {
      if (this.isEdit) {
        this.$emit("cancel-edit");
      }
      this.closeReminderForm();
    },
    closeReminderForm() {
      if (this.isEdit) {
        this.resetReminderForm();
      } else {
        this.clearReminderForm();
      }
    },
    resetReminderForm() {
      this.text = this.reminder.text;
      this.date = this.reminder.date;
      this.time = this.reminder.time;
      this.window = this.reminder.window;
      this.weekdays = this.reminder.weekdays;
      this.startDate = this.reminder.startDate;
    },
    clearReminderForm() {
      this.text = "";
      this.date = "";
      this.time = "";
      this.window = [null, null, null, null, null, null];
      this.weekdays = [];
      this.startDate = "";
      this.showForm = false;
    },
    save() {
      const msgType = this.isEdit ? "edit-reminder" : "create-reminder";
      this.showError = false;
      if (this.text.length > 0) {
        this.$emit(msgType, {
          text: this.text,
          date: this.date,
          time: this.time,
          window: this.window,
          weekdays: this.weekdays,
          startDate: this.startDate
        });
        this.closeReminderForm();
      } else {
        this.showError = true;
      }
    },
    revealInfo(evt) {
      // the info icon is an SVG element.
      // Depending on exactly where the user clicks,
      // sometimes the clicked target is a path instead of the svg element
      let ancestor;
      if (evt.path) {
        ancestor = evt.path[1].parentElement.parentElement;
      } else {
        ancestor = evt.target.parentElement.parentElement;
      }
      let style = ancestor && ancestor.children[1].style;
      if (style !== undefined) {
        if (!style.display) {
          style.display = "inline-block";
        } else {
          style.display = "";
        }
      }
    }
  }
};
</script>

<style scoped>
input#description {
  width: 80%;
}
.form {
  background-color: #212027;
  border: 1px solid #212027;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.group.three .cell {
  position: relative;
  float: left;
}
.group.three .cell + .cell {
  margin-left: 2em;
}
input[type="number"] {
  width: 4rem;
}
.hover-info-action {
  margin-right: 0;
  margin-left: 5px;
}
.border {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.categories {
  margin-top: -0.75em;
}
.date {
  display: inline-block;
}
.hover-info {
  display: none;
  position: absolute;
  top: 50px;
  opacity: 0.8;
  background-color: #000;
  border: 1px solid #777;
  padding: 5px;
  z-index: 9;
}
label:hover .hover-info {
  display: inline-block;
}
.divider-word {
  margin: 0 1em;
}
.expl {
  margin-left: 0.5em;
}
.divider-word,
.expl {
  color: #929292;
}
.req,
.error {
  font-weight: normal;
  font-style: italic;
  margin-left: 1em;
  letter-spacing: normal;
}
.req {
  color: #ffbc00ab;
}
.error {
  color: #ffbc00;
}
.clr-selector {
  margin-bottom: 1em;
}
.weekday,
label.checkbox,
input[type="checkbox"] {
  display: inline-block;
}
input[type="checkbox"] {
  visibility: hidden;
  width: 1em;
}
input[type="checkbox"]:checked + label::before {
  content: "✓ ";
  margin-left: -1.2em;
  color: #29dc58;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s, transform 1s;
  transform: scaleY(1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
.slidefade-enter-active,
.slidefade-leave-active {
  transition: opacity 1s, transform 1s, max-height 2s;
  transform: scaleY(1);
  max-height: 50em;
}
.slidefade-enter,
.slidefade-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}
</style>
