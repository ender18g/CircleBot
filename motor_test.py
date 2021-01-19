from board import SCL, SDA
import busio
from adafruit_pca9685 import PCA9685
from time import sleep
  # Create the I2C bus interface.
i2c_bus = busio.I2C(SCL, SDA)
  # Create a simple PCA9685 class instance.
pca = PCA9685(i2c_bus)
  # Set the PWM frequency to 60hz.
pca.frequency = 1000
pca.channels[0].duty_cycle = 200
sleep(3)
pca.channels[0].duty_cycle = 0
sleep(3)
