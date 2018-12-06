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
          <!--
          <div class="clr-selector">
            <span
              v-for="clr in colors"
              :key="clr"
              class="clr"
              :class="'clr-' + clr"
              :title="clr"
              @click="selectClr(clr)"
            >&nbsp;</span>
          </div>
          -->
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
              required
            >
            <input id="time" name="time" v-model="time" type="time" placeholder="hh:mm">
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
        null
      ],
      showForm: !!(this.reminder && this.reminder.text),
      showError: false,
      colors: ["", "red", "blue", "green", "yellow", "purple"]
    };
  },
  computed: {
    isEdit() {
      return !!(this.reminder && this.reminder.text);
    },
    isValid() {
      return this.text && this.date;
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
    },
    clearReminderForm() {
      this.text = "";
      this.date = "";
      this.time = "";
      this.window = [null, null, null, null, null];
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
          window: this.window
        });
        this.closeReminderForm();
      } else {
        this.showError = true;
      }
    },
    revealInfo(evt) {
      // the info icon is an SVG element.
      // Sometimes the target is a path instead of the svg element
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
.expl {
  margin-left: 0.5em;
  color: #929292;
}
.req,
.error {
  font-style: italic;
  margin-left: 1em;
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
