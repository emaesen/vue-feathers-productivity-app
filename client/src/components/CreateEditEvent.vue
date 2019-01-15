<template>
  <div :class="[{form: showForm}, {border: showForm && !isEdit}]">
    <transition name="fade">
      <button
        v-if="!showForm && !isEdit"
        class="action button absolute top right spaced"
        @click="openEventForm"
      >
        <font-awesome-icon icon="plus-circle"/>add event
      </button>
    </transition>
    <transition name="slidefade">
      <div v-if="showForm" class>
        <div class>
          <div class>
            <label for="text">
              Event title
              <span v-if="!showError && !isValid" class="req">(required)</span>
              <span v-if="showError" class="error">Please provide a title</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              maxlength="108"
              v-model="title"
              placeholder="Event title"
              required
            >
          </div>
          <div class>
            <label for="text">Event description</label>
            <textarea
              id="description"
              name="description"
              v-model="description"
              :style="{height: textAreaHeight + 'px'}"
              placeholder="Event description"
            />
          </div>
          <div class>
            <label for="date">
              Date &amp; time
              <span v-if="!showError && !isValid" class="req">(required)</span>
              <span v-if="showError" class="error">Please provide a date</span>
            </label>
            <input
              id="date"
              name="date"
              v-model="date.start"
              type="date"
              placeholder="yyyy-mm-dd"
              min="new Date()"
            >
            <input
              id="time"
              name="time"
              v-model="time.start"
              type="time"
              placeholder="hh:mm"
              step="300"
            >
            <span class="divider-word">to</span>
            <input
              id="time-end"
              name="time-end"
              v-model="time.end"
              type="time"
              placeholder="hh:mm"
              step="300"
            >
            <input
              id="date-end"
              name="date-end"
              v-model="date.end"
              type="date"
              placeholder="yyyy-mm-dd"
              min="new Date()"
            >
          </div>

          <div class="group">
            <div class="cell">
              <label>Repeat every week</label>
              <div class="weekday" v-for="(day, index) in week" :key="day">
                <input type="checkbox" :id="day" :value="index" v-model="weekdays">
                <label :for="day" class="action button checkbox">
                  <span class="day" :class="day">{{ day }}</span>
                </label>
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
import { mapGetters } from "vuex";
import calendarUtils from "../utils/calendar";

export default {
  name: "CreateEditEvent",
  props: {
    event: {
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
      title: (this.event && this.event.title) || "",
      description: (this.event && this.event.description) || "",
      date: {
        start: (this.event && this.event.date && this.event.date.start) || "",
        end: (this.event && this.event.date && this.event.date.end) || ""
      },
      time: {
        start: (this.event && this.event.time && this.event.time.start) || "",
        end: (this.event && this.event.time && this.event.time.end) || ""
      },
      weekdays: (this.event && this.event.weekdays) || [],
      showForm: !!(this.event && this.event.title),
      showError: false,
      week: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    };
  },
  updated() {
    if (this.calendar && this.calendar.dayInFocus && !this.date.start) {
      this.date.start = calendarUtils.yyyy_mm_dd(this.calendar.dayInFocus.date);
    }
  },
  computed: {
    ...mapGetters(["calendar"]),
    isEdit() {
      return !!(this.event && this.event.title);
    },
    isValid() {
      return (
        // TODO: set proper isValid conditions
        this.title && this.date.start
      );
    },
    textAreaHeight() {
      const minHeight = 150;
      return this.contentHeight > minHeight ? this.contentHeight : minHeight;
    }
  },
  methods: {
    openEventForm() {
      this.showForm = true;
      this.showError = false;
    },
    cancel() {
      if (this.isEdit) {
        this.$emit("cancel-edit");
      }
      this.closeEventForm();
    },
    closeEventForm() {
      if (this.isEdit) {
        this.resetEventForm();
      } else {
        this.clearEventForm();
      }
    },
    resetEventForm() {
      this.title = this.event.title;
      this.description = this.event.description;
      this.date = this.event.date;
      this.time = this.event.time;
      this.weekdays = this.event.weekdays;
    },
    clearEventForm() {
      this.title = "";
      this.description = "";
      this.date = { start: "", end: "" };
      this.time = { start: "", end: "" };
      this.weekdays = [];
      this.showForm = false;
    },
    save() {
      const msgType = this.isEdit ? "edit-event" : "create-event";
      this.showError = false;
      if (this.title.length > 0) {
        this.$emit(msgType, {
          title: this.title,
          description: this.description,
          date: this.date,
          time: this.time,
          weekdays: this.weekdays
        });
        this.closeEventForm();
      } else {
        this.showError = true;
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
input[type="number"] {
  width: 4rem;
}
.border {
  border: 1px solid #555;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 5px;
}
.date {
  display: inline-block;
}
.divider-word {
  margin: 0 1em;
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
input[type="text"] {
  min-width: 250px;
  width: 75%;
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
