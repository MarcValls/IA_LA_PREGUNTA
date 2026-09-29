from playwright.sync_api import sync_playwright
from pathlib import Path
import subprocess,time,os,signal
root=Path(__file__).resolve().parents[1]
server=subprocess.Popen(['python','-m','http.server','8899','--bind','127.0.0.1'],cwd=root/'frontend',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(.5)
try:
  with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
    for name,size in [('desktop',{'width':1600,'height':1000}),('mobile',{'width':390,'height':844})]:
      page=browser.new_page(viewport=size)
      errs=[]
      page.on('pageerror', lambda e,errs=errs: errs.append(str(e)))
      page.goto('http://127.0.0.1:8899/index.html',wait_until='domcontentloaded',timeout=15000)
      page.wait_for_timeout(800)
      print(name,'title=',page.title(),'errors=',errs)
      print(name,'teacher=',page.locator('#teacher-panel').is_visible(),'msgcount=',page.locator('#teacher-messages .teacher-message').count())
      print(name,'step=',page.locator('#offline-step-label').inner_text())
      print(name,'focus=',page.locator('#teacher-focus-label').inner_text())
      print(name,'next_disabled=',page.locator('#teacher-next').is_disabled())
      page.screenshot(path=str(root/'qa/screens'/f'{name}_start.png'),full_page=False)
      if name=='desktop':
        page.locator('#teacher-next').click()
        page.wait_for_timeout(200)
        print('after next step=',page.locator('#offline-step-label').inner_text(),'focus=',page.locator('#teacher-focus-label').inner_text())
        print('question visible text=',page.locator('.opening-question').inner_text())
        page.screenshot(path=str(root/'qa/screens'/'desktop_step2.png'),full_page=False)
      page.close()
    browser.close()
finally:
  server.terminate();
  try: server.wait(timeout=3)
  except: server.kill()
