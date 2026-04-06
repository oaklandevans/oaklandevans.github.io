# Debugging the White Screen

I've added comprehensive error handling and debugging to help identify the issue. Here's what to do:

## 1. Open Browser Developer Tools
- Press **F12** or **Cmd+Option+I** (macOS)
- Go to the **Console** tab

## 2. Look for Console Logs
When you navigate to the Mario Online game, you should see logs like:
```
[Game] Initializing with canvas: 1000 x 500
[Game] Initialized successfully, sprites: 15
[Game] Starting game loop
[Game] Game loop started with interval: 40
```

If you **DON'T see these logs**, then the game is not initializing at all.

## 3. Check for Errors
Look for any errors in the console. Common issues:

### Issue 1: Canvas Element Not Found
- Error: "Cannot read property 'width' of null"
- Solution: Check that the canvas ref is properly attached

### Issue 2: Image Loading Failed
- Errors like: "[Tube] Draw error:" or "[Mario] Draw error:"
- This means images failed to load
- Check Network tab in DevTools to see if images are 404
- The ASSET_BASE is set to `/Mario_Online/`

### Issue 3: Other Runtime Errors
- Any other error will be printed to the console
- Look for the specific error message

## 4. What Should You See?
After the game starts, you should see:
- A light blue canvas (sky)
- A light green area at the bottom (ground)
- Mario sprite in the center
- Various tubes and goombas around the level

## 5. Test Steps
1. Navigate to http://localhost:5173/mario-online (or your local dev URL)
2. Open the browser console (F12)
3. Check for the `[Game]` logs
4. Check for any errors
5. Look at the canvas - should have colors

## Possible Root Causes

### Canvas not rendering at all
- Check that canvas context is properly obtained
- The canvas size should be 1000x500

### All white background
- Canvas background color issue
- GameView.update() might not be called
- Check console logs to confirm game loop is running

### Black background (dark)
- This is actually from the CSS container background
- The canvas should be overlaying it
- Check z-index or positioning

## Network Requests
In the Network tab of DevTools, check:
1. Do the image files load? (mario1.png, tube.png, etc.)
2. Do they return 200 status?
3. Are they the correct size?

If images return 404, then the ASSET_BASE path needs adjustment.

## Manual Test
In the browser console, you can test if images load:
```javascript
const img = new Image()
img.src = '/Mario_Online/mario1.png'
console.log('Image loading:', img)
// After a few milliseconds, check img.complete
```

---

**Next Steps**: Share the console output and any error messages, and we can troubleshoot further!

