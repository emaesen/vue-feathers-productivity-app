<template>
  <transition name="slidefade">
    <div class="filters">
      <div class="filter-group">
        <span class="filter-type">Colors:</span>
        <span
          class="action button cntr clear clr-none"
          :class="{checked: noColorFiltered}"
          @click="clearColorFilter"
        >none</span>
        ➔
        <div class="filter" v-for="color in colors" :key="color">
          <input type="checkbox" :id="'clr-' + color" :value="color" v-model="filter.colors">
          <label :for="'clr-' + color" class="action button">
            <span class="clr cntr" :class="'clr-' + color">({{ colorsCount['clr-'+color] }})</span>
          </label>
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-type">Categories:</span>
        <span
          class="action button cntr clear cat-none"
          :class="{checked: noCategoryFiltered}"
          @click="clearCategoryFilter"
        >none</span>
        ➔
        <div class="filter" v-for="category in categories" :key="category">
          <div v-if="category.length>0">
            <input type="checkbox" :id="category" :value="category" v-model="filter.categories">
            <label :for="category" class="action button">
              {{ category }}
              <span class="cntr">({{ categoriesCount['cat-'+category] }})</span>
            </label>
          </div>
        </div>
        <div class="filter">
          <div v-if="categoriesCount['cat-']!==undefined">
            <input type="checkbox" id="none" :value="''" v-model="filter.categories">
            <label for="none" class="action button none">
              ✗
              <span class="cntr">({{ categoriesCount['cat-'] }})</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "FilterControl",
  props: ["filter", "colors", "categories", "filterMeta"],
  mounted() {
    // console.log({filterMeta:this.filterMeta});
    // console.log({colorsCount:this.colorsCount});
    // console.log({categoriesCount:this.categoriesCount});
  },
  methods: {
    metaCounter(type, attr, pre) {
      let metas = {};
      let metasItr = type
        .map(c => {
          const reducer = (acc, cur) => (cur[attr] === c ? acc + 1 : acc);
          let nr = this.filterMeta.reduce(reducer, 0);
          let key = pre + c;
          return { [key]: nr };
        })
        .values();
      for (const meta of metasItr) {
        metas = { ...metas, ...meta };
      }
      return metas;
    },
    clearColorFilter() {
      // clear the colors filter array by removing all elements
      this.filter.colors.splice(0);
    },
    clearCategoryFilter() {
      // clear the categories filter array by removing all elements
      this.filter.categories.splice(0);
    }
  },
  computed: {
    colorsCount() {
      return this.metaCounter(this.colors, "color", "clr-");
    },
    categoriesCount() {
      return this.metaCounter(this.categories, "category", "cat-");
    },
    noColorFiltered() {
      return this.filter.colors.length === 0;
    },
    noCategoryFiltered() {
      return this.filter.categories.length === 0;
    }
  }
};
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
span.clear.checked::before,
input[type="checkbox"]:checked + label::before {
  content: "✓ ";
  margin-left: -1.2em;
  color: #29dc58;
}
.clear {
  margin-left: 0.9em;
}
label.action.button {
  vertical-align: initial;
  margin-left: -0.5em;
  margin-right: 0.3em;
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
.filter-type {
  display: inline-block;
  min-width: 4.5rem;
}
.clr {
  margin: 0;
}
.cntr {
  text-align: center;
  font-style: normal;
  font-weight: 400;
  color: #948972;
  line-height: 22px;
  font-size: 14px;
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