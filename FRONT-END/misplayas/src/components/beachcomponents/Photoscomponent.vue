<template>
  <div>
    <div>
      <section v-for="photo in photos" :key="photo.id">
        <img src="photo.link" />
        <p>{{photo.description}}</p>
        <p>{{photo.date}}</p>
      </section>
    </div>
  </div>
</template>


<script>
export default {
  name: "Photoscomponent.vue",
  props: {
    photos: Array,
  },
};
</script>