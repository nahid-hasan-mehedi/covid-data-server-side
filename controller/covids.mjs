//import fs from 'fs';

import {Covid} from '../model/covid.mjs';

/**
 * A function that adds a contact to the database.
 * @param {Request} req - A request Object
 * @param {Response} res - A response Object
 */

export async function addCovidRecord(req, res) {
    let iso_code  = req.body.iso_code;
    let continent = req.body.continent;
    let location = req.body.location; 
    let date = req.body.date;
    let total_cases = req.body.total_cases;
    let new_cases = req.body.new_cases;
    let total_deaths = req.body.total_deaths;
    let new_deaths = req.body.new_deaths;
    //let isValid = await validate_fields(name, email, tel, address);
    
    let new_covid = new Covid(iso_code,continent,location,date,total_cases,new_cases,total_deaths,new_deaths);
    let msg = await new_covid.save();
    res.send(msg);                
    
    //console.log('The Contact was not inserted in the database since it is not valid.');
    //res.send('Error. User not inserted in the database.');
    
}

export async function getCovidRecord(req, res){
    let date_to_match = req.params.date;
    let obj = await Covid.get(date_to_match);
    if (obj.length > 0){
        console.log(obj.length+' item(s) sent.');
        res.send(obj[0]);        
    }else{
        res.send('No item was found');
    }
    
}

export async function getAllCovidRecord(req, res){
    let obj = await Covid.getAll();
    if (obj.length > 0){
        console.log(obj.length+' item(s) sent.');
        res.send(obj);        
    }else{
        res.send('No item was found');
    }
    
}

export async function deleteCovidRecord(req, res) {
    let date_to_delete = req.params.date;
    let msg = await Covid.delete(date_to_delete);
    res.send(msg);
}

export async function getDatesBetweenCovidRecord(req, res) {
    let all_records = await Covid.getAll();
    let dates_to_delete = req.params.fromAndTo.split('_');
    let start = Date.parse(dates_to_delete[0]);
    let end = Date.parse(dates_to_delete[1]);

    let sum = 0;
    for (let index = 0; index < all_records.length; index++) {
        const record = all_records[index];
        const current_record_date = Date.parse(record.date);
        if (isNaN(current_record_date)) {
            continue;
        }
        
        if ((current_record_date >= start) && (current_record_date <= end)) {
            let deaths = record.total_deaths;
            deaths = parseInt(deaths);
            if (!isNaN(deaths)) {
                sum += deaths;
            }
        }
    }
    

    res.send(sum.toString());
}



export async function updateCovidRecord(req, res) {
    let date_to_match = req.params.date;
    let obj = await Covid.update(date_to_match, req.body);
    if (obj.length > 0){
        console.log(obj.length+' item(s) sent.');
        res.send(obj[0]);        
    }else{
        res.send('No item was found');
    }
    
}

//export { getCovidRecord };



