import sys
import os.path

root = os.path.dirname(__file__)

sys.path.insert(0, os.path.join(root, 'site-packages'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'studentmanage.settings'
sys.path.append(os.path.join(os.path.dirname(__file__), 'studentmanage'))

import sae
from studentmanage import wsgi
  
application = sae.create_wsgi_app(wsgi.application)