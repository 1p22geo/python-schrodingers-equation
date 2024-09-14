from kivy.app import App
from kivy.uix.widget import Widget
from kivy.graphics import Color, Ellipse, Line


class MyPaintWidget(Widget):
    def __init__(self, **kwargs):
        super(MyPaintWidget, self).__init__(**kwargs)
        self.touchpos: None | (int, int) = None

    def on_touch_down(self, touch):
        self.touchpos = (touch.x, touch.y)
        with self.canvas:
            Color(1, 0, 0)
            Ellipse(pos=(touch.x - 2, touch.y - 2), size=(4, 4))

    def on_touch_up(self, touch):
        self.touchpos = None

    def on_touch_move(self, touch):
        with self.canvas:
            Color(1, 0, 0)
            Line(points=[*self.touchpos, touch.x, touch.y], width=2.0)
            self.touchpos = (touch.x, touch.y)


class MyPaintApp(App):
    def build(self):
        return MyPaintWidget()


if __name__ == '__main__':
    MyPaintApp().run()
