<script>
	export let value, label, type = 'text';
	
	function typeAction(node){
		node.type = type;
	}
</script>

<p class="form-control">
	{#if label}
		<label class="label" for>{label}:</label>
	{/if}
	<input use:typeAction class="input" bind:value={value}/>
</p>
