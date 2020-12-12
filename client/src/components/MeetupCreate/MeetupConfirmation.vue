<template>
  <div>
    <h1 class="title m-b-sm">Please confirm entered data</h1>

    <div class="content">
      <div>
        <span class="result-title">
          Location
        </span>
        <p>{{ this.formData.location }}</p>
      </div>
      <div>
        <span class="result-title">
          Title
        </span>
        <p>{{ this.formData.title }}</p>
      </div>
      <div>
        <span class="result-title">
          Start Date
        </span>
        <p>{{ this.formData.startDate }}</p>
      </div>
      <div>
        <span class="result-title">
          From
        </span>
        <p>{{ this.formData.timeFrom }}</p>
      </div>
      <div>
        <span class="result-title">
          To
        </span>
        <p>{{ this.formData.timeTo }}</p>
      </div>
      <div>
        <span class="result-title">
          Category
        </span>
        <p>{{ this.formData.category.name }}</p>
      </div>
      <div>
        <span class="result-title">
          Image
        </span>
        <p>{{ this.formData.image }}</p>
      </div>
      <div>
        <span class="result-title">
          Short Info
        </span>
        <p>{{ this.formData.shortInfo }}</p>
      </div>
      <div>
        <span class="result-title">
          Description
        </span>
        <p>{{ this.formData.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },

  validations: {},
};
</script>

<style scoped>
.result-title {
  font-size: 29px;
  font-weight: bold;
}

.result-title + p {
  font-size: 20px;
}
</style>
