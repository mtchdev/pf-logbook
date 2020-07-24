# projectFLY Logbook Exporter (STKP Format)

Special thanks to **AndrewTech** for making the STKP formatter!  

Export your **entire logbook** into a simple JSON file in less than 60 seconds which can be used to import into STKP.  

### Installation

you might want this: [https://git-scm.com/downloads](https://git-scm.com/downloads)
1. Install **Node.JS** (> v10) from: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)  
2. Open Terminal or Command Prompt and type the following:

```
git clone https://github.com/mtchdev/pf-logbook.git
cd pf-logbook
npm install
```

This will install the script onto your computer, from which you can use it by doing:
```
npm start
```

This step will prompt you for your **authentication token**, which can be obtained like this:  
![tutorial](https://i.imgur.com/Ln0OpCK.png)

Paste the `authToken` string into the console and press enter. It will automatically create a `.json` file where the repository was cloned.
