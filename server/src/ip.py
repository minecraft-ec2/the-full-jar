import requests

ip = requests.get('http://169.254.169.254/latest/meta-data/public-ipv4')

with open('API_KEY.txt', 'r') as file:
    key = file.read().replace('\n', '')
    requests.post('https://us-central1-minecraft-ec2-492ee.cloudfunctions.net/api/ip',
                  headers={'Authorization': key}, data={'ip': ip})
