#!/usr/bin/python
# coding: utf-8
from flask import Flask
from math import floor
import json
app = Flask(__name__,static_folder='react-frontend/build',static_url_path='/')

running_pi = False

motor_dict = {'LMotor':0,'RMotor':1}
MAX_THROTTLE=10 #percentage of max power
MAX_DIFF=5
FORWARD_PER=0
DIFF_PER=0


if running_pi:
  from board import SCL, SDA
  import busio
  from adafruit_pca9685 import PCA9685
  # Create the I2C bus interface.
  i2c_bus = busio.I2C(SCL, SDA)
  # Create a simple PCA9685 class instance.
  pca = PCA9685(i2c_bus)
  # Set the PWM frequency to 60hz.
  pca.frequency = 1000
  # Set the PWM duty cycle for channel zero to 50%. duty_cycle is 16 bits to match other PWM objects
  # but the PCA9685 will only actually give 12 bits of resolution.
  #max value=4095, lowest = 0
  for k,v in motor_dict.items():
    pca.channels[v].duty_cycle = 0;


def set_throttle(FORWARD_PER,DIFF_PER):
  #forward 0 to 100% and diff -100% (left) to 100%(right)
  print(f"setting throttle {FORWARD_PER}")
  forward_DC = floor(MAX_THROTTLE/100 * FORWARD_PER/100 * 4095)
  differential_DC = abs(floor(MAX_DIFF/100* DIFF_PER/100*4095)) 
  if DIFF_PER>=0: # you want to go right, left needs more
    left_DC = forward_DC+differential_DC
    right_DC = forward_DC
  if DIFF_PER<0: # you want to go left, right needs more
    left_DC = forward_DC
    right_DC = forward_DC+differential_DC
  #for a positive differential, L motor moves faster for a right turn
  if (running_pi):
    pca.channels[motor_dict['LMotor']].duty_cycle = left_DC
    pca.channels[motor_dict['RMotor']].duty_cycle = right_DC
  output_dict = {'Left':left_DC,'Right':right_DC}
  print(output_dict)
  return output_dict

### Functions to run the bot

import pickle
def get_mqtt_sensor():
  with open('sensor.pickle','rb') as f:
    data = pickle.load(f)
  return data


##Flask Functions
@app.route('/')
def index():
  return app.send_static_file('index.html')


@app.route('/sensor')
def sensor():
  data=get_mqtt_sensor();
  return data

@app.route('/forward/<forward>')
#needs a throttle and diffential between 0 and 100
def go_forward(forward=0):
  forward = int(forward)
  ##make sure they are in range, else kill the throttle
  if (forward not in range(101)):
    output = set_throttle(0,0)
    return json.dumps(output.update({'error':'forward out of range'}))
  ## passed the test, now send to throttle
  FORWARD_PER=forward
  output = set_throttle(FORWARD_PER,DIFF_PER)
  return json.dumps(output)

@app.route('/turn/<differential>')
#needs a throttle and diffential between 0 and 100
def turn(differential=0):
  differential= int(differential)
  ##make sure they are in range, else kill the throttle
  if (differential not in range (-100,101)):
    output = set_throttle(0,0)
    return json.dumps(output.update({'error':'differential not in range'}))
  ## passed the test, now send to throttle
  DIFF_PER=differential
  output = set_throttle(FORWARD_PER,DIFF_PER)
  return json.dumps(output)



if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')


    #{"magnetometer": [17.75, -35.875, -13.0625], "calibration": 48, "quaternion": [0.9996948, -0.02008057, 0.01287842, 0.0], "temperature": 28, "timestamp": 738364, "accelerometer": [-0.23, -0.39, 9.44], "gyroscope": [-0.001111111, 0.002222222, 0.0], "linear_acceleration": [0.03, 0.0, -0.34], "euler": [0.0, -1.4375, 2.25]}
