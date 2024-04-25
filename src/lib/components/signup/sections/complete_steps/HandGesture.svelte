<script>
  export let data;

  const { width, src, height } = data.image;
  const { categoryName, categoryScore, handedness } = data;
</script>

<div class="flex justify-center mb-2">
  <div>
    <img alt="" {height} {src} {width} />
    <div class="text-sm text-center mt-2 flex flex-col">
      <div>GestureRecognizer: {categoryName}</div>
      <div>
        <div>Confidence: {categoryScore}%</div>
        <div>Handedness: {handedness}</div>
      </div>
    </div>
  </div>
</div>
