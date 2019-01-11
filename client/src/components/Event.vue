<template>
  <div class="cell events-list-cell">
    <div :id="'event-'+event._id" class="event">
      <transition name="fade" mode="out-in" @after-enter="editTransitionComplete">
        <div
          v-if="!isEditing"
          class="actionable trans"
          :class="{collapsed: isCollapsed}"
          @click="toggleCollapse"
          :style="{
            maxHeight: maxEventHeight + 'px',
            'transition-duration': transitionDuration + 's'
          }"
        >
          <div ref="content">
            <div class="date-time">
              {{ time.startTime }}
              <span
                class="ampm"
                v-if="time.startTime && time.startAmPm !== time.endAmPm"
              >{{ time.startAmPm }}</span>
              {{ time.startTime && time.endTime ? " - " : "" }}{{ time.endTime }}
              <span
                class="ampm"
                v-if="time.endTime"
              >{{ time.endAmPm }}</span>
            </div>
            <div class="category">{{ event.category }}</div>
            <div class="content-text" :class="'clr-' + event.color">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-description" v-html="descriptionAsHtml"/>
            </div>
            <div class="action-row" :class="{hidden:isCollapsed}">
              <button class="action button" title="edit" @click="showForm">
                <font-awesome-icon icon="edit"/>edit
              </button>

              <transition name="fade" mode="out-in">
                <button
                  v-if="!isDeleteClicked"
                  class="action button"
                  title="delete"
                  @click="deleteEvent(event)"
                >
                  <font-awesome-icon icon="trash-alt"/>delete
                </button>
                <div v-if="isDeleteClicked" class="confirm">
                  Confirm Delete:
                  <button
                    class="action button"
                    title="delete"
                    @click="deleteEvent(event, true)"
                  >
                    <font-awesome-icon icon="trash-alt"/>yes!
                  </button>
                  <button class="action button" title="delete" @click="deleteEvent(event, false)">
                    <font-awesome-icon icon="ban"/>no
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <pa-edit-event
          v-if="isEditing"
          :event="event"
          :categories="categories"
          :contentHeight="maxEventHeight"
          @edit-event="editEvent"
          @cancel-edit="cancelEdit"
          @edit-event-warning="editEventWarning"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import EditEvent from "./CreateEditEvent";

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
      .replace(/^(⋯?)- (.*)\n/gm, "$1⋞$2\n")
      .replace(/^([^⋞]*\n)⋞/gm, "$1⋐\n⋞")
      .replace(/^(⋞.+\n)⋯⋞/gm, "$1⋯⋐\n⋯⋞")
      .replace(/^(⋯⋞.+\n)⋞/gm, "$1⋯⋑\n⋟\n⋞")
      .replace(/^(⋯?⋞.+[^⋟])(\n⋯(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n⋯(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋯?⋞.+[^⋟])(\n(⋑|⋞))/gm, "$1⋟$2")
      .replace(/^(⋞.+)\n\n/gm, "$1⋟\n⋑\n\n")
      .replace(/⋯/g, "  ")
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
  name: "Event",
  components: {
    "pa-edit-event": EditEvent
  },
  props: {
    event: {
      type: Object,
      default: function() {
        return {
          title: "",
          description: "",
          date: { start: "", end: "" },
          time: { start: "", end: "" },
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
    }
  },
  data() {
    return {
      isEditing: false,
      resetStyle: false,
      isCollapsed: !!this.initCollapsed && true,
      nrOfCharsWhenCollapsed: 15,
      maxEventHeight: "100",
      transitionDuration: "1",
      isDeleteClicked: false
    };
  },
  mounted: function() {
    this.setContentStyleProps();
  },
  computed: {
    descriptionAsHtml() {
      return simpleFormat(this.event.description);
    },
    time() {
      let timeStart = this.event.time.start.split(":");
      let timeEnd = this.event.time.end.split(":");
      let timeStartTxt = "all day";
      let timeEndTxt = "";
      let ampmStartTxt = "";
      let ampmEndTxt = "";
      if (timeStart[1]) {
        timeStartTxt =
          (1 * timeStart[0] > 12 ? 1 * timeStart[0] - 12 : 1 * timeStart[0]) +
          ":" +
          timeStart[1];
        ampmStartTxt = 1 * timeStart[0] > 12 ? "PM" : "AM";
      }
      if (timeEnd[1]) {
        timeEndTxt =
          (1 * timeEnd[0] > 12 ? 1 * timeEnd[0] - 12 : 1 * timeEnd[0]) +
          ":" +
          timeEnd[1];
        ampmEndTxt = 1 * timeEnd[0] > 12 ? "PM" : "AM";
      }
      console.log({ timeStart, timeStartTxt, timeEnd, timeEndTxt });
      return {
        startTime: timeStartTxt,
        endTime: timeEndTxt,
        startAmPm: ampmStartTxt,
        endAmPm: ampmEndTxt
      };
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
        this.maxEventHeight = elHeight;
        // calculate transition duration such that the transition speed
        // is fairly consistent for various event heights. (in seconds)
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
          // Mostly relevant in grid-view since the event width there
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
    deleteEvent(event, isConfirmed) {
      if (typeof isConfirmed === "undefined") {
        // ask for confirmation
        this.isDeleteClicked = true;
      } else {
        this.isDeleteClicked = false;
        if (isConfirmed) {
          this.$emit("delete-event", event);
        }
      }
    },
    showForm() {
      this.isEditing = true;
      this.origEvent = Object.assign({}, this.event);
    },
    editEvent(mod) {
      this.isEditing = false;
      this.$emit("edit-event", { event: this.event, mod: mod });
      this.resetStyle = true;
    },
    cancelEdit() {
      this.event.title = this.origEvent.title;
      this.event.description = this.origEvent.description;
      this.event.date = this.origEvent.date;
      this.event.time = this.origEvent.time;
      this.event.category = this.origEvent.category;
      this.isEditing = false;
    },
    editEventWarning(warning) {
      this.$emit("edit-event-warning", warning);
    }
  }
};
</script>

<style scoped>
.event {
  padding: 5px;
}
.content-text {
  padding: 0 5px;
  border-left: 3px solid #000;
  border-right: 3px solid #000;
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

.event hr {
  border-style: groove;
}
.date-time,
.category {
  float: right;
  font-style: italic;
  color: #cec0a1;
  font-size: 90%;
  padding: 0 10px;
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
