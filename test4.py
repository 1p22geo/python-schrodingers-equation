from kivy.app import App
from kivy.uix.widget import Widget
from kivy.graphics import Rectangle, Color, Ellipse, Line
from kivy.uix.gridlayout import GridLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.config import Config
Config.set('graphics', 'resizable', '0')
Config.set('graphics', 'width', '1920')
Config.set('graphics', 'height', '1080')


class Test4GraphWidget(Widget):
    def __init__(self, **kwargs):
        super(Test4GraphWidget, self).__init__(**kwargs)
        self.width = 1600
        self.height = 800
        self.draw()

    def draw(self):
        with self.canvas:
            print(self.pos)
            Color(1, 1, 1)
            Rectangle(pos=self.pos, size=self.size)


class Test4Layout(Widget):
    pass


class Test4App(App):
    def build(self):
        layout = FloatLayout(size=(1920, 1200))
        widget = Test4GraphWidget(pos=(100, 100))
        layout.add_widget(widget)
        return layout


if __name__ == '__main__':
    Test4App().run()
