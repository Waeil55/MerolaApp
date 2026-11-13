# Publishing Genius Kids Academy to the App Store and Google Play

The apps are built. These steps are the parts only you can do, because they need your identity, payment and final "Submit" click. Use the account **waeil.dev@gmail.com** everywhere.

All texts to paste are in [LISTING.md](LISTING.md). Screenshots and graphics are in the `screenshots` and `graphics` folders next to it.

---

## Part 1: Google Play (Android)

### 1. Create the developer account (one time, $25)
1. Open https://play.google.com/console/signup and sign in with waeil.dev@gmail.com.
2. Choose **Yourself** (a personal account).
3. Pay the $25 fee, then verify your identity with a photo ID. Google also asks you to install the Play Console app on an Android phone to verify the device.
4. Approval can take a few days. Google emails you when it's done.

### 2. Create the app
1. In Play Console, click **Create app**.
2. App name: `Genius Kids Academy`. Default language: English (United States). Choose **App** and **Free**. Tick the declarations, then click **Create app**.

### 3. Fill in "Set up your app" on the Dashboard
Go through each task. The answers are in LISTING.md:
- **Privacy policy**: https://waeil55.github.io/MerolaApp/privacy.html
- **App access**: "All functionality is available without special access". In the instructions box, paste the "App review notes" paragraph.
- **Ads**: No.
- **Content rating**: fill in the questionnaire (category: Reference, News, or Educational). Answer No to every question.
- **Target audience**: tick 5 and under, 6–8 and 9–12. This puts the app in the Families program, which the app already follows: no ads, no tracking, and a parent gate.
- **Data safety**: "No, my app does not collect or share any of the required user data types".
- **Government apps, financial features, health, news**: No.

### 4. Store listing
**Grow users → Store presence → Main store listing**:
- Short and full description from LISTING.md.
- App icon: `graphics/play-icon-512.png`
- Feature graphic: `graphics/feature-graphic-1024x500.png`
- Phone screenshots: all 8 files in `screenshots/android-phone/`
- Category: Education. Contact email: waeil.dev@gmail.com

### 5. Upload the app for closed testing (required for new personal accounts)
Google requires **12 testers using the app for 14 days in a row** before a new personal account can publish to everyone.
1. Go to **Test and release → Testing → Closed testing → Create track**.
2. Create a release and upload this file: `Documents\Genius Kids Academy store files\genius-kids-academy-1.0.0.aab`
3. When asked about **Play App Signing**, keep Google's recommended option. Google then holds the final signing key, and our upload key only signs uploads.
4. Under **Testers**, make an email list of at least 12 people (family and friends with Android phones). Save, then **Send for review / Roll out**.
5. Send testers the opt-in link shown on the Testers tab. They join, install the app from Play and keep it installed for 14 days.
6. After 14 days, the Dashboard shows **Apply for production**. Answer the short questions, then create the production release. That last **Roll out** click is yours.

> **Keep the signing key safe.** `Documents\Genius Kids Academy signing key` holds the key that signs every Android update. Back it up (for example to a USB stick or your cloud drive). The password is in the READ ME file in the same folder.

---

## Part 2: Apple App Store (iPhone and iPad)

The iPhone app is built on a Mac in the cloud (GitHub Actions), so you don't need a Mac.

### 1. Join the Apple Developer Program (one time, $99 per year)
1. Make sure the Apple ID **waeil.dev@gmail.com** exists and has two-factor authentication on. You can create the Apple ID at https://account.apple.com.
2. Open https://developer.apple.com/programs/enroll, sign in, and enroll as an **Individual**. Your legal name appears as the seller.
3. Pay $99. Apple may ask for a photo ID in the Apple Developer app. Approval usually takes 1 to 2 days.

### 2. Register the app ID
1. Open https://developer.apple.com/account/resources/identifiers/list and click **+**.
2. Choose **App IDs → App**. Description: `Genius Kids Academy`. Bundle ID: **Explicit**, `dev.waeil.geniuskids`. Click **Continue → Register**.

### 3. Create the app in App Store Connect
1. Open https://appstoreconnect.apple.com → **Apps → + → New App**.
2. Platform **iOS**, name `Genius Kids Academy`, language English (U.S.), bundle ID `dev.waeil.geniuskids`, SKU `geniuskids001`, User Access **Full Access**.

### 4. Create an API key, so the cloud Mac can upload builds for you
1. In App Store Connect, open **Users and Access → Integrations → App Store Connect API → Team Keys**, then click **+** (the first time, click **Request Access**).
2. Name: `GitHub upload`. Access: **Admin**. Click **Generate**.
3. Write down the **Issuer ID** (shown above the table) and the **Key ID**. Click **Download** to get the `.p8` file. Apple lets you download it only once.
4. Find your **Team ID**: https://developer.apple.com/account → **Membership details**.

### 5. Put the four values into GitHub (they stay secret there)
1. Open https://github.com/Waeil55/MerolaApp/settings/secrets/actions → **New repository secret**.
2. Add these four, one at a time:

| Name | Value |
|---|---|
| `APPLE_TEAM_ID` | your Team ID (10 letters and numbers) |
| `ASC_KEY_ID` | the Key ID |
| `ASC_ISSUER_ID` | the Issuer ID |
| `ASC_KEY_P8` | open the `.p8` file in Notepad and paste **everything** in it, including the BEGIN and END lines |

Don't paste these values into the chat. GitHub keeps them hidden.

### 6. Build and upload the iPhone app
1. Open https://github.com/Waeil55/MerolaApp/actions/workflows/apps.yml
2. Click **Run workflow**, tick **upload**, then click the green **Run workflow** button.
3. It takes about 15 to 25 minutes. When it shows a green tick, the build appears in App Store Connect under **TestFlight** after Apple processes it (10 to 30 more minutes).
4. Optional: in TestFlight, add yourself as an internal tester and try the app on your iPhone with the TestFlight app.

### 7. Fill in the App Store page
In App Store Connect → your app → **iOS App 1.0**:
- Screenshots: drag the 8 files from `screenshots/iphone-6.9/` into the **iPhone 6.9"** box and the 8 files from `screenshots/ipad-13/` into the **iPad 13"** box.
- Promotional text, description, keywords, support URL, subtitle and copyright: from LISTING.md.
- **Build**: click **+** and pick the build from step 6.
- **App Review Information**: no sign-in needed. Paste the "App review notes" into Notes.
- **App Information**: Category Education. **Kids**: Ages 6–8. Content rights: no third-party content.
- **Age Rating**: answer None/No to everything. The result should be 4+.
- **App Privacy**: privacy policy URL, then **Data Not Collected**.
- **Pricing and Availability**: Free, all countries.

### 8. Submit
Click **Add for Review → Submit**. Review usually takes 1 to 3 days. Apple emails you when the app is approved or if they have questions.

---

## Updating the apps later
Ask Claude to "make a new app version". It raises the version number, builds a new Android file for you to upload to Play, and starts the iPhone upload on GitHub.
