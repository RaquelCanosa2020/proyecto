<template>
  <div>
    <div>
      <section v-for="vote in votes" :key="vote.id">
        <p>{{vote.date}}</p>
        <p>{{vote.value}}</p>
        <p>{{vote.comment}}</p>
        <p>{{vote.name}}</p>
      </section>
    </div>
  </div>
</template>


<script>
export default {
  name: "Ratingscomponent.vue",
  props: {
    votes: Array,
  },
};
</script>