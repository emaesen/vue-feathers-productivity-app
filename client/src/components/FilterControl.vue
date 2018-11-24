<template>
  <transition name="slidefade">
  <div class="filters">
    <div class="filter-group">
      Colors: 
      <div class="filter"
        v-for="color in colors"
        :key="color"
      >
        <input type="checkbox" :id="'clr-' + color" :value="color" v-model="filter.colors">
        <label :for="'clr-' + color"><span
                class="clr"
                :class="'clr-' + color"
              >&nbsp;</span></label>
      </div>
    </div>
    <div class="filter-group">
      Categories: 
      <div class="filter"
        v-for="category in categories"
        :key="category"
      >
        <input type="checkbox" :id="category" :value="category" v-model="filter.categories">
        <label :for="category" class="action button">{{ category }}</label>
      </div>
      <div class="filter">
        <input type="checkbox" id="none" :value="''" v-model="filter.categories">
        <label for="none" class="action button none">✗</label>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  props: [
    'filter',
    'colors',
    'categories'
  ]
}
</script>

<style scoped>
input,
label {
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
label {
  margin-left: -0.2em;
  margin-right: 0.3em;
}
.filters {
  padding: 5px;
}
.filter {
  display: inline-block;
}
.none {
  color: #948972;
}
.clr {
  margin: 0;
}
.slidefade-enter-active,
.slidefade-leave-active {
  transition: opacity 0.5s, transform 0.5s, max-height 0.6s;
  transform: scaleY(1);
  max-height: 75px;
}
.slidefade-enter,
.slidefade-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}
</style>