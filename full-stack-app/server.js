const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const puppeteer = require('puppeteer');
const $ = require('cheerio');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * We are doing some webscraping first. We are using puppeteer and cheerio
 * to accomplish this. Afterwards, we generate a JSON file 
 * with the data we gathered. After we have generated the JSON file,
 * we are sending the data through an express route. 
 */

const url = 'https://www.soulfx.com/about-soulfx/team/';
const selector = 'main section:nth-child(2) div div ul li';
const fileName = 'employees.json';

let data = [];

/** See if file exists */
fs.exists(fileName, (exists) => {
  if (!exists) {
    puppeteer
      .launch()
      .then((browser) => browser.newPage())
      .then((page) => {
        return page.goto(url).then(() => {
          return page.content();
        });
      })
      .then((html) => {
        /** push data to array */
        $(selector, html).each(function () {

          const image = $(this).children('img').attr('src');
          const name = $(this).children('img + span').text();
          const job = $(this).children('img + span + span').text();

          data.push({
            name,
            job,
            image
          })

        });

        /** Generate JSON file */
        fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
          return err ? console.error(err) : console.log(`Data saved to ${fileName}.`);
        });

      })
      .catch((err) => {
        console.log(err)
      });
  } else {
    /** Set parsedData to data variable */
    const employeesJSON = fs.readFileSync(fileName);
    const parsedData = JSON.parse(employeesJSON)
    data = parsedData;
  }
});


// API calls
app.get('/api/employees', (req, res) => {
  /** This is our query param that we are passing onto the endpoint */
  const { name } = req.query;

  let employeeData = [];

  /** If our query exists */
  if (name !== undefined) {
    /** ES6 filtering */
    employeeData = data.filter((employee) => {
      return employee.name.toLowerCase().includes(name.toLowerCase());
    });
  } else {
    employeeData = data;
  }

  res.send({
    data: employeeData
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.log(`Unhandled Rejection at: Promise, ${p}, reason: ${reason}`);
  process.exit(1);
});
