<template>
  <div class="events">
    <div
      :key="index"
      class="event"
      :class="event.classes"
      @click="expandEvent(event)"
      v-for="(event, index) in events"
    >
      <div class="event-title">{{ event.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalendarEventsBox",
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  computed: {},
  methods: {
    expandEvent(event) {
      console.log("CLICK! expandEvent", event);
    }
  }
};
</script>

<style scoped>
.events .event {
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>