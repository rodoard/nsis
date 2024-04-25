<script>
  export let data;

  const { width, src, height } = data.image;
</script>

<div class="flex justify-center mb-4">
  <img alt="" {height} {src} {width} />
</div>
