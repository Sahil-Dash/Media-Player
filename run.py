from path import *
import subprocess

command1 = CLIENT_PATH
command2 = SERVER_PATH

subprocess.Popen(["cmd.exe", "/k", command1])

subprocess.Popen(["cmd.exe", "/k", command2])