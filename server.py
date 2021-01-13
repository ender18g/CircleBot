#!/usr/bin/python
# coding: utf-8
from flask import Flask, Response
from math import floor
from importlib import import_module
import os


import json
app = Flask(__name__,static_folder='react-frontend/build',static_url_path='/')

running_pi = True

motor_dict = {'LMotor':0,'RMotor':1}
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
  pca.frequency = 100
  for k,v in motor_dict.items():
    pca.channels[v].duty_cycle = 0;
    ### SETUP INV PINS FOR MOTORS
  from gpiozero import DigitalOutputDevice
  #https://gpiozero.readthedocs.io/en/stable/recipes.html#pin-numbering
  #ues pins 38.40 on raspi
  left_inv = DigitalOutputDevice(20)
  right_inv = DigitalOutputDevice(21)

#### still on pi, get camera
  from camera_pi import Camera
  def gen(camera):
    """Video streaming generator function."""
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
  
  @app.route('/video')
  def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')



def set_throttle(FORWARD_PER,DIFF_PER):
  Max_Hex=0xFFFF
  #forward 0 to 100% and diff -100% (left) to 100%(right)
  print(f"setting throttle {FORWARD_PER}")
  forward_DC = floor(FORWARD_PER/100 * Max_Hex)
  differential_DC = floor(abs(DIFF_PER/100* Max_Hex))

  if DIFF_PER==0:
    left_DC=forward_DC
    right_DC=forward_DC
    if(running_pi):
      left_inv.off()
      right_inv.off()
  elif DIFF_PER>0: # you want to go right, left needs more
    left_DC = differential_DC
    right_DC = differential_DC
    if(running_pi):
      left_inv.off()
      right_inv.on()
  elif DIFF_PER<0: # you want to go left, right needs more
    left_DC = differential_DC
    right_DC = differential_DC
    if(running_pi):
      left_inv.on()
      right_inv.off()
  #for a positive differential, L motor moves faster for a right turn
  if (running_pi):
    pca.channels[motor_dict['LMotor']].duty_cycle = left_DC
    pca.channels[motor_dict['RMotor']].duty_cycle = right_DC
  output_dict = {'Left':left_DC,'Right':right_DC,'Diff':DIFF_PER}
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

@app.route('/throttle/<forward>/<differential>')
#needs a throttle and diffential between 0 and 100
def go_forward(forward,differential):
  forward = int(forward)
  differential=int(differential)
  ##make sure they are in range, else kill the throttle
  if (forward not in range(101)):
    output = set_throttle(0,0)
    return json.dumps(output.update({'error':'forward out of range'}))
  if (differential not in range(-101,101)):
    output = set_throttle(0,0)
    return json.dumps(output.update({'error':'differential out of range'}))
  ## passed the test, now send to throttle
  output = set_throttle(forward,differential)
  return json.dumps(output)



if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',threaded=True)


    #{"magnetometer": [17.75, -35.875, -13.0625], "calibration": 48, "quaternion": [0.9996948, -0.02008057, 0.01287842, 0.0], "temperature": 28, "timestamp": 738364, "accelerometer": [-0.23, -0.39, 9.44], "gyroscope": [-0.001111111, 0.002222222, 0.0], "linear_acceleration": [0.03, 0.0, -0.34], "euler": [0.0, -1.4375, 2.25]}
