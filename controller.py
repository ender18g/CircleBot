import pickle
from time import sleep
import os
from math import floor

CORRECTION_RATE = 40

import argparse
parser = argparse.ArgumentParser()
parser.add_argument("-pi",help="declare whether running on raspberry pi 0 or 1",type=int,default=1)
args=parser.parse_args()

running_pi=args.pi
print(f"Running Pi: {running_pi}")

def load_pickle(filename):
  if os.path.getsize(filename) <= 0:
    return False
  with open(filename,'rb') as f:
    data=pickle.load(f)
    return data

def save_pickle(data,filename):
  with open(filename,'wb') as f:
    pickle.dump(data,f)

def sleep_me():
  sleep(1/CORRECTION_RATE)
#{'Left': 13107, 'Right': 13107, 'Controller': 'on', 'Heading': 10.375, 'Diff': 0, 'PID': [1, 0, 0], 'Forward': 20}

def get_heading_error(h1,h2):
  #h2 is actual heading
  #h1 is requested heading
  result = (h2-h1+540)%360-180
  #positive result means right of course
  return result

def calculate_correction(heading_error, sum_error,PID_gains):
  [Kp,Ki,Kd]=PID_gains
  error_history.pop(0)
  error_history.append(heading_error);
  average_error = sum(error_history)

  p_component = Kp * heading_error
  d_component = Kd* heading_error-prev_error
  i_component = Ki * sum_error
  #if error is positive, then we need more right throttle
  total_correction =-(p_component+d_component+i_component)
  return total_correction

def apply_motor(forward_base_per,correction):
  Max_Hex=0xFFFF
  forward_DC = floor(forward_base_per/100 * Max_Hex)
  correction_DC=floor((forward_base_per+abs(correction))/100 * Max_Hex)

  if correction >=0:
    #need to go right so more LEFT
    left_DC=correction_DC
    right_DC=forward_DC
  elif correction <0:
    #need to go left so more right
    left_DC=forward_DC
    right_DC=correction_DC
    
  print(f"correction left:{left_DC} right:{right_DC}")
  if running_pi:
    #if running on pi actually apply changes
    pca.channels[0].duty_cycle=min(left_DC,0xFFFF)
    pca.channels[1].duty_cycle=min(right_DC,0xFFFF)

heading_history=[]
sum_error=0
prev_error=0
heading_error=0
error_history = [0,0,0,0,0];



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
  pca.channels[0].duty_cycle = 0;
  pca.channels[1].duty_cycle = 0;


while True:
  ## load the controller data
  try:
    command_req = load_pickle('command.pickle')
  except:
    continue

  #print(command_req)
  ## if the controller is off, continue to next loop
  if not command_req or not command_req.get('Controller'):
    if heading_history:
    #clear and save previous headings
      heading_history={'requested':heading_history[0],'history':heading_history}
      save_pickle(heading_history,'headings.pickle')
      ##initialize variables for next run
      heading_history=[]
      sum_error=0
      prev_error=0
      print('Heading list saved')

    sleep_me()
    continue
  else:
    req_heading=command_req.get('Heading')
    PID_gains=command_req.get('PID')
    forward_base_per = command_req.get('Forward')
  # get curr heading data
  try:
    imu_data = load_pickle('sensor.pickle')
  except:
    continue

  if imu_data:
    cur_heading = imu_data.get('euler')[0]
    heading_history.append(cur_heading)
  else:
    continue
  prev_error=heading_error
  heading_error=get_heading_error(req_heading,cur_heading)
  sum_error+=heading_error

  #print(f"Current: {cur_heading} | Requested: {req_heading} | Error: {heading_error}")
  correction = calculate_correction(heading_error,sum_error,PID_gains)
  apply_motor(forward_base_per,correction)

  sleep_me()


  #get difference in heading
  #(h2 - h1 + 540) % 360 - 180;



  
