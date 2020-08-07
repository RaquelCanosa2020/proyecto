<template>
  <div>
    <div>
      <p>{{$route.params.id}},</p>
    </div>
  </div>
</template>


<script>
export default {
  name: "Beachcomponent",
  props: {
    beach: Object,
  },
};
</script>