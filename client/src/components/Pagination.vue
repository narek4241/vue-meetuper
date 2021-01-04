<template>
  <div class="pagination-container-wrapper">
    <!-- #note 'v-model' replaced by 'value' opt -->
    <paginate
      :value="pageNumber"
      :page-count="pageCount"
      :click-handler="clickHandler"
      :prev-text="prevText"
      :next-text="nextText"
      :container-class="'paginationContainer'"
    >
    </paginate>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      required: false,
    },

    pageCount: {
      required: true,
    },

    clickHandler: {
      type: Function,
      required: false,
    },

    prevText: {
      type: String,
      required: false,
      default: 'Prev',
    },

    nextText: {
      type: String,
      required: false,
      default: 'Next',
    },
  },

  computed: {
    pageNumber() {
      return parseInt(this.page);
    },
  },
};
</script>

<style lang="scss">
.pagination-container-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

// #note taken opt
.paginationContainer {
  display: inline-block;
  padding-left: 0;
  margin: 20px 0;
  border-radius: 4px;

  > li {
    display: inline;
    font-size: 18px;

    > a {
      position: relative;
      float: left;
      padding: 6px 12px;
      margin-left: -1px;
      line-height: 1.42857143;
      color: #00d1b2;
      text-decoration: none;
      background-color: #fff;
      border: 1px solid #ddd;
      outline: 0;
    }

    &.active {
      > a {
        z-index: 2;
        color: #fff;
        cursor: default;
        background-color: #00d1b2;
        border-color: #00d1b2;
      }
    }

    &.disabled {
      > a {
        color: #777;
        cursor: not-allowed;
        background-color: #fff;
        border-color: #ddd;
      }
    }
  }
}
</style>
