<script>
  export let data;

  const { width, src, height } = data.image;
  const { categoryName, categoryScore, handedness, securityProtocol } = data;
</script>

<div class="flex justify-center">
  <div>
    <img alt="" {height} {src} {width} />
    <div class="text-sm text-center mt-2 flex flex-col">
      <div>GestureRecognizer: {categoryName}</div>
      <div>
        <div>Confidence: {categoryScore}%</div>
        <div>Handedness: {handedness}</div>
      </div>
      <div>Security Protocol: {securityProtocol}</div>
    </div>
  </div>
</div>
