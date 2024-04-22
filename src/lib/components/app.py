import gradio as gr

demo = gr.Interface(fn=add, inputs=["number", "number"], outputs="number")

demo.launch()