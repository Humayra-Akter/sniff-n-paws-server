import express from "express";
import connection from "./connection.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3002;
const router = express.Router();

app.use(cors());
app.use(express.json());

//admin queries
app.get("/admin", (req, res) => {
  connection
    .get_data("select * from ADMIN_VIEW")
    .then((result) => {
      //console.log(result);
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/admin_password/:email/:password", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;

  console.log(email, password);

  connection
    .get_data(
      `select * from admin where EMAIL='${email}' and PASSWORD='${password}'`
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/admin_delete/:id", (req, res) => {
  const id = req.params.id;
  connection
    .insert("delete from ADMIN where ADMIN_ID=:id", { id: id })
    .then((result) => {
      //console.log(result);
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/admin_update/:set/:sv/:fdn/:val", (req, res) => {
  const set = req.params.set;
  const sv = req.params.sv;
  const fdn = req.params.fdn;
  const val = req.params.val;

  connection
    .get_data(
      "update ADMIN set " + set + "='" + sv + "' where " + fdn + "=" + val
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/admin_insert/:name/:email/:gender/:city/:street/:house/:dob/:salary/:designation/:phone",
  (req, res) => {
    const name = req.params.name;
    const email = req.params.email;
    const gender = req.params.gender;
    const city = req.params.city;
    const street = req.params.street;
    const house = req.params.house;
    const dob = req.params.dob;
    const salary = req.params.salary;
    const designation = req.params.designation;
    const phone = req.params.phone;

    const params = {
      1: name,
      2: email,
      3: gender,
      4: city,
      5: street,
      6: house,
      7: dob,
      8: salary,
      9: designation,
    };

    connection
      .insert(
        `Insert into ADMIN(NAME, EMAIL, GENDER, ADDRESS, DOB, SALARY, DESIGNATION)
    values (:1,:2,:3,ADDR(:4,:5,:6),to_date(:7,'dd-mm-yyyy'),:8,:9)`,
        params
      )
      .then((result) => {
        //res.send(result);
        connection
          .insert(
            `insert into ADMIN_PHONE (ADMIN_ID, PHONE_NO)
        values ((select max(ADMIN_ID) from ADMIN),:1)`,
            { 1: phone }
          )
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.send(error.message);
          });
      })
      .catch((error) => {
        res.send(error);
      });
  }
);

app.get("/admin_phone_insert/:phone", (req, res) => {
  const phone = req.params.phone;

  connection
    .get_data(
      `insert into ADMIN_PHONE (ADMIN_ID, PHONE_NO)
    values ((select ADMIN_ID from ADMIN
        where ROWID=(
            select max(rowid) from ADMIN
            )), ${phone})`
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//staff queries
app.get("/staff", (req, res) => {
  connection
    .get_data("select * from STAFF_VIEW")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/staff_password/:email/:password", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;

  console.log(email, password);

  connection
    .get_data(
      `select * from staff where EMAIL='${email}' and PASSWORD='${password}'`
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/staff_specialization", (req, res) => {
  connection
    .get_data("select * from STAFF_SPECIALIZATION")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/staff_delete/:id", (req, res) => {
  const id = req.params.id;
  connection
    .insert("delete from staff where staff_ID=:id", { id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/staff_update/:set/:sv/:fdn/:val", (req, res) => {
  const set = req.params.set;
  const sv = req.params.sv;
  const fdn = req.params.fdn;
  const val = req.params.val;

  connection
    .get_data(
      "update staff set " + set + "='" + sv + "' where " + fdn + "=" + val
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/staff_insert/:name/:email/:gender/:city/:street/:house/:dob/:salary/:specialization/:phone",
  (req, res) => {
    const name = req.params.name;
    const email = req.params.email;
    const gender = req.params.gender;
    const city = req.params.city;
    const street = req.params.street;
    const house = req.params.house;
    const dob = req.params.dob;
    const salary = req.params.salary;
    const specialization = req.params.specialization;
    const phone = req.params.phone;

    const params = {
      1: name,
      2: email,
      3: gender,
      4: city,
      5: street,
      6: house,
      7: dob,
      8: salary,
      9: specialization,
    };

    connection
      .insert(
        `insert into STAFF (NAME, EMAIL, GENDER,ADDRESS, DOB, SALARY, SPECIALIZATION)
        values (:1, :2, :3, ADDR(:4, :5, :6), to_date(:7, 'dd-mm-yyyy'), :8, :9)`,
        params
      )
      .then((result) => {
        console.log(result);
        connection
          .insert(
            `insert into STAFF_PHONE (STAFF_ID, PHONE_NO)
            values ((select max(STAFF_ID) from STAFF), :1)`,
            { 1: phone }
          )
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.send(error);
          });
      })
      .catch((error) => {
        res.send(error);
      });
  }
);
//customer queries
app.get("/customer", (req, res) => {
  connection
    .get_data("select * from CUSTOMER_VIEW")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_animal_cabin", (req, res) => {
  connection
    .get_data("select * from CUSTOMER_ANIMAL_CABIN")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_animal_cabin/:id", (req, res) => {
  connection
    .get_data(
      "select * from CUSTOMER_ANIMAL_CABIN where CUSTOMER_ID=" + req.params.id
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_pricing", (req, res) => {
  connection
    .get_data("select * from CUSTOMER_PRICING")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/total_daycare_services", (req, res) => {
  connection
    .get_data("select * from TOTAL_DAYCARE_SERVICES")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_delete/:id", (req, res) => {
  const id = req.params.id;
  connection
    .insert("delete from customer where customer_ID=:id", { id: id })
    .then((result) => {
      //console.log(result);
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_password/:email/:password", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;

  console.log(email, password);

  connection
    .get_data(
      `select * from CUSTOMER where EMAIL='${email}' and PASSWORD='${password}'`
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_update/:set/:sv/:fdn/:val", (req, res) => {
  const set = req.params.set;
  const sv = req.params.sv;
  const fdn = req.params.fdn;
  const val = req.params.val;

  connection
    .get_data(
      "update customer set " + set + "='" + sv + "' where " + fdn + "=" + val
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/customer_insert/:name/:email/:gender/:city/:street/:house/:dob/:phone",
  (req, res) => {
    const name = req.params.name;
    const email = req.params.email;
    const gender = req.params.gender;
    const city = req.params.city;
    const street = req.params.street;
    const house = req.params.house;
    const dob = req.params.dob;
    const phone = req.params.phone;

    const params = {
      1: name,
      2: email,
      3: gender,
      4: city,
      5: street,
      6: house,
      7: dob,
    };

    connection
      .insert(
        `insert into CUSTOMER (NAME, EMAIL, GENDER, ADDRESS, DOB)
    values (:1,:2,:3,ADDR(:4,:5,:6),to_date(:7,'dd-mm-yyyy'))`,
        params
      )
      .then((result) => {
        //res.send(result);
        connection
          .insert(
            `insert into CUSTOMER_PHONE (CUSTOMER_ID, PHONE_NO)
        values ((select max(CUSTOMER_ID) from CUSTOMER),:1)`,
            { 1: phone }
          )
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.send(error);
          });
      })
      .catch((error) => {
        res.send(error);
      });
  }
);

//vet queries
app.get("/veterinarian", (req, res) => {
  connection
    .get_data("SELECT * FROM vet_v")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/vet_password/:email/:password", (req, res) => {
  const email = req.params.email;
  const password = req.params.password;

  console.log(email, password);

  connection
    .get_data(
      `select * from veterinarian where EMAIL='${email}' and PASSWORD='${password}'`
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/veterinarian_shift_view", (req, res) => {
  connection
    .get_data("SELECT * FROM shift_view")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/veterinarian_delete/:id", (req, res) => {
  const id = req.params.id;

  connection
    .insert("DELETE FROM VETERINARIAN WHERE vet_id = :id", { id: id })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/veterinarian_update/:set/:sv/:fdn/:val", (req, res) => {
  const set = req.params.set;
  const sv = req.params.sv;
  const fdn = req.params.fdn;
  const val = req.params.val;

  connection
    .get_data(
      "UPDATE VETERINARIAN SET " +
        set +
        "='" +
        sv +
        "' WHERE " +
        fdn +
        "=" +
        val
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/veterinarian_insert/:name/:email/:gender/:city/:street/:house/:dob/:salary/:qualification/:phone",
  (req, res) => {
    const name = req.params.name;
    const email = req.params.email;
    const gender = req.params.gender;
    const city = req.params.city;
    const street = req.params.street;
    const house = req.params.house;
    const dob = req.params.dob;
    const salary = req.params.salary;
    const qualification = req.params.qualification;
    const phone = req.params.phone;

    const params = {
      1: name,
      2: email,
      3: gender,
      4: city,
      5: street,
      6: house,
      7: dob,
      8: salary,
      9: qualification,
    };

    connection
      .insert(
        `INSERT INTO VETERINARIAN (NAME, EMAIL, GENDER,ADDRESS, DOB, SALARY, QUALIFICATION)
    VALUES (:1, :2, :3, ADDR(:4, :5, :6), TO_DATE(:7, 'dd-mm-yyyy'), :8, :9)`,
        params
      )
      .then((result) => {
        connection

          .insert(
            `INSERT INTO VET_PHONE (vet_id, PHONE_NO)
        VALUES ((SELECT MAX(vet_id) FROM VETERINARIAN), :1)`,
            { 1: phone }
          )
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.send(error);
          });
      })
      .catch((error) => {
        res.send(error);
      });
  }
);

app.get("/veterinarian_phone_insert/:vet_id/:phone", (req, res) => {
  const vet_id = req.params.vet_id;
  const phone = req.params.phone;

  connection
    .get_data(
      `INSERT INTO VET_PHONE (vet_id, PHONE_NO)
    VALUES (:1, :2)`,
      { 1: vet_id, 2: phone }
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/vet_phone_insert/:vet_id/:phone", (req, res) => {
  const vet_id = req.params.vet_id;
  const phone = req.params.phone;

  connection
    .get_data(
      `INSERT INTO VET_PHONE (vet_id, PHONE_NO)
    VALUES (:1, :2)`,
      { 1: vet_id, 2: phone }
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/doctor_shift", (req, res) => {
  connection
    .get_data("select * from DOCTOR_SHIFT")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/daycare_animal_history", (req, res) => {
  connection
    .get_data("select * from DAYCARE_ANIMAL_HISTORY")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/rescued_animal_history", (req, res) => {
  connection
    .get_data("select * from RESCUED_ANIMAL_HISTORY")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/doctor_shift/:id", (req, res) => {
  connection
    .get_data("select * from DOCTOR_SHIFT where vet_id=" + req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/vet_animal", (req, res) => {
  connection
    .get_data("select * from VET_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//feedback
app.get("/feedback", (req, res) => {
  connection
    .get_data("SELECT * FROM FEEDBACK_VIEW")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/positive_feedback", (req, res) => {
  connection
    .get_data("SELECT * FROM positive_feedback")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/negative_feedback", (req, res) => {
  connection
    .get_data("SELECT * FROM negative_feedback")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/feedback_admin_review", (req, res) => {
  connection
    .get_data("SELECT * FROM admin_review")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/feedback_service_review", (req, res) => {
  connection
    .get_data("SELECT * FROM service_review")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/feedback_veterinarian_review", (req, res) => {
  connection
    .get_data("SELECT * FROM VETERINARIAN_review")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/feedback_staff_review", (req, res) => {
  connection
    .get_data("SELECT * FROM staff_review")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/avg_rate", (req, res) => {
  connection
    .get_data("SELECT * FROM average_rating")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get(
  "/feedback_insert/:subject/:date/:rating/:message/:customerId",
  (req, res) => {
    const subject = req.params.subject;
    const date = req.params.date;
    const rating = req.params.rating;
    const message = req.params.message;
    const customerId = req.params.customerId;

    const params = {
      1: subject,
      2: date,
      3: rating,
      4: message,
      5: customerId,
    };

    connection
      .insert(
        `insert into FEEDBACK (FEEDBACK_SUBJECT, F_DATE, RATING, MESSAGE, CUSTOMER_ID)
        values (:1, to_date(:2, 'dd-mm-yyyy'), :3, :4, :5)`,
        params
      )
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }
);

///animal queries
app.get("/day_care_animal", (req, res) => {
  connection
    .get_data("select * from DAYCARE_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/daycare_animal_insert/:age/:breed/:weight/:rate/:type/:coming_date/:release_date/:cabin_no/:health_record_id/:customer_id",
  (req, res) => {
    const age = req.params.age;
    const breed = req.params.breed;
    const weight = req.params.weight;
    const rate = req.params.rate;
    const type = req.params.type;
    const coming_date = req.params.coming_date;
    const release_date = req.params.release_date;
    const cabin_no = req.params.cabin_no;
    const health_record_id = req.params.health_record_id;
    const customer_id = req.params.customer_id;

    const params = {
      age: age,
      breed: breed,
      weight: weight,
      rate: rate,
      type: type,
      coming_date: coming_date,
      release_date: release_date,
      cabin_no: cabin_no,
      health_record_id: health_record_id,
      customer_id: customer_id,
    };

    connection
      .insert(
        `
    INSERT INTO DAYCARE_ANIMAL (AGE, BREED, WEIGHT, RATE, TYPE, COMING_DATE, RELEASE_DATE, CABIN_NO, HEALTH_RECORD_ID, CUSTOMER_ID)
    VALUES (:age, :breed, :weight, :rate, :type, TO_DATE(:coming_date, 'dd-mm-yyyy'), TO_DATE(:release_date, 'dd-mm-yyyy'), :cabin_no, :health_record_id, :customer_id)
  `,
        params
      )
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }
);
app.get("/healthy_day_care_animal", (req, res) => {
  connection
    .get_data("select * from HEALTHY_DAYCARE_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/isolated_day_care_animal", (req, res) => {
  connection
    .get_data("select * from ISOLATED_DAYCARE_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/unvaccinated_day_care_animal", (req, res) => {
  connection
    .get_data("select * from UNVACCINATED_DAYCARE_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//rescued animal
app.get("/rescued_animal", (req, res) => {
  connection
    .get_data("select * from RESCUED_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/rescued_animal_insert/:age/:breed/:weight/:rate/:type/:coming_date/:release_date/:cabin_no/:health_record_id/:customer_id",
  (req, res) => {
    const age = req.params.age;
    const breed = req.params.breed;
    const weight = req.params.weight;
    const rate = req.params.rate;
    const type = req.params.type;
    const coming_date = req.params.coming_date;
    const release_date = req.params.release_date;
    const cabin_no = req.params.cabin_no;
    const health_record_id = req.params.health_record_id;
    const customer_id = req.params.customer_id;

    const params = {
      age: age,
      breed: breed,
      weight: weight,
      rate: rate,
      type: type,
      coming_date: coming_date,
      release_date: release_date,
      cabin_no: cabin_no,
      health_record_id: health_record_id,
      customer_id: customer_id,
    };

    connection
      .insert(
        `INSERT INTO DAYCARE_ANIMAL (AGE, BREED, WEIGHT, RATE, TYPE, COMING_DATE, RELEASE_DATE, CABIN_NO, HEALTH_RECORD_ID, CUSTOMER_ID)
    VALUES (:age, :breed, :weight, :rate, :type, TO_DATE(:coming_date, 'dd-mm-yyyy'), TO_DATE(:release_date, 'dd-mm-yyyy'),
    :cabin_no, :health_record_id, :customer_id)`,
        params
      )
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }
);

app.get("/healthy_rescued_animal", (req, res) => {
  connection
    .get_data("select * from HEALTHY_RESCUED_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/isolated_rescued_animal", (req, res) => {
  connection
    .get_data("select * from ISOLATED_RESCUED_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/unvaccinated_rescued_animal", (req, res) => {
  connection
    .get_data("select * from UNVACCINATED_RESCUED_ANIMAL")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//health record
app.get("/health_record", (req, res) => {
  connection
    .get_data("select * from health_record_view")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//update health record
app.get("/health_record_update/:set/:sv/:fdn/:val", (req, res) => {
  const set = req.params.set;
  const sv = req.params.sv;
  const fdn = req.params.fdn;
  const val = req.params.val;

  connection
    .get_data(
      "update health_record set " +
        set +
        "='" +
        sv +
        "' where " +
        fdn +
        "=" +
        val
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/disease_insert/:record_id/:disease_name", (req, res) => {
  const record_id = req.params.record_id;
  const disease_name = req.params.disease_name;

  const params = {
    1: record_id,
    2: disease_name,
  };

  connection
    .insert(
      `insert into DISEASES (HEALTH_RECORD_ID, DISEASE_NAME)
    VALUES (:1, :2)`,
      params
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/health_record_insert/:rabies/:rab_date/:flu/:flu_date/:spay_neuter/:animal_identifier",
  (req, res) => {
    const rabies = req.params.rabies;
    const rab_date = req.params.rab_date;
    const flu = req.params.flu;
    const flu_date = req.params.flu_date;
    const spay_neuter = req.params.spay_neuter;
    const animal_identifier = req.params.animal_identifier;

    const params = {
      1: rabies,
      2: rab_date,
      3: flu,
      4: flu_date,
      5: spay_neuter,
      6: animal_identifier,
    };

    connection
      .insert(
        `INSERT INTO HEALTH_RECORD (RABIES, RABIES_DATE, FLU, FLU_DATE, SPAY_NEUTER, ANIMAL_IDENTIFIER)
    VALUES (:1, TO_DATE(:2, 'dd-mm-yyyy'), :3, TO_DATE(:4, 'dd-mm-yyyy'), :5, :6)`,
        params
      )
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }
);

//rescuer
app.get("/rescuer", (req, res) => {
  connection
    .get_data("SELECT * FROM RESCUER_VIEW")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get("/rescuerInfo", (req, res) => {
  connection
    .get_data("SELECT * FROM RESCUE_INFO")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/customer_rescuer", (req, res) => {
  connection
    .get_data("SELECT * FROM cust_rescuer")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/rescuer_insert/:name/:phone", (req, res) => {
  const name = req.params.name;
  const phone = req.params.phone;

  let rescuerId;

  const rescuerParams = {
    name: name,
  };

  connection
    .insert(
      `
    INSERT INTO RESCUER (NAME)
    VALUES (:name)
    RETURNING RESCUER_ID INTO :rescuerId
  `,
      rescuerParams
    )
    .then((result) => {
      rescuerId = result.outBinds.rescuerId;

      const phoneParams = {
        rescuerId: rescuerId,
        phone: phone,
      };

      return connection.insert(
        `
        INSERT INTO RESCUER_PHONE (RESCUER_ID, PHONE_NO)
        VALUES (:rescuerId, :phone)
      `,
        phoneParams
      );
    })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//donations
app.get("/customer_donation", (req, res) => {
  connection
    .get_data("select * from CUSTOMER_DONATION")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/non_customer_donation", (req, res) => {
  connection
    .get_data("select * from NON_CUSTOMER_DONATION")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/donation", (req, res) => {
  connection
    .get_data("select * from DONATION order by donation_no")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get(
  "/donation_insert/:name/:amount/:donation_date/:customer_id",
  (req, res) => {
    const name = req.params.name;
    const amount = req.params.amount;
    const donation_date = req.params.donation_date;
    const customer_Id = req.params.customer_id;

    const params = {
      1: name,
      2: amount,
      3: donation_date,
      4: customer_Id,
    };

    connection
      .insert(
        `insert into DONATION (NAME, AMOUNT, DONATION_DATE, CUSTOMER_ID)
        values (:1, :2, to_date(:3, 'dd-mm-yyyy'), :4)`,
        params
      )
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }
);

//log in functions
app.get("/login/:username", (req, res) => {
  const username = req.params.username;

  connection
    .get_data("select status from login where username='" + username + "'")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/login/:email", (req, res) => {
  const username = req.params.username;

  connection
    .get_data("select status from login where username='" + username + "'")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/login_insert/:email/:type/:status", (req, res) => {
  const username = req.params.email;
  const type = req.params.type;
  const status = req.params.status;

  const params = {
    1: username,
    2: type,
    3: status,
  };

  connection
    .insert(
      `insert into login (email, user_type, status)
      values (:1, :2, :3)`,
      params
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//logout
app.get("/logout", (req, res) => {
  connection
    .get_data(
      "update login set status=0 where  serial=(select max(serial) from login)"
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//daycare_animal_record_view
app.get("/daycare_animal_record_view", (req, res) => {
  connection
    .get_data("select * from daycare_animal_record_view")
    .then((result) => {
      //console.log(result);
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//rescued_animal_record_view
app.get("/rescued_animal_record_view", (req, res) => {
  connection
    .get_data("select * from rescued_animal_record_view")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_selfinfo/:email", (req, res) => {
  connection
    .get_data("select * from customer_view where EMAIL=" + req.params.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/customer_cabin/:email", (req, res) => {
  connection
    .get_data(
      "select  * from  CUSTOMER_ANIMAL_CABIN where CUSTOMER_ID =(select CUSTOMER_ID from CUSTOMER where EMAIL=" +
        req.params.email +
        ")"
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_donation/:email", (req, res) => {
  connection
    .get_data("select * from CUSTOMER_DONATION where EMAIL=" + req.params.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
///customer dashboard
app.get("/c_feedback/:email", (req, res) => {
  connection
    .get_data("select * from FEEDBACK_VIEW where EMAIL=" + req.params.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/customer_price/:email", (req, res) => {
  connection
    .get_data(
      "select  * from  CUSTOMER_PRICING where CUSTOMER_ID =(select CUSTOMER_ID from CUSTOMER where EMAIL=" +
        req.params.email +
        ")"
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//customer dashboard
app.get("/customer_selfinfo/:email", (req, res) => {
  connection
    .get_data("select * from customer_view where EMAIL=" + req.params.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/customer_cabin/:email", (req, res) => {
  connection
    .get_data(
      "select  * from  CUSTOMER_ANIMAL_CABIN where CUSTOMER_ID =(select CUSTOMER_ID from CUSTOMER where EMAIL=" +
        req.params.email +
        ")"
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/customer_donation/:email", (req, res) => {
  connection
    .get_data("select * from CUSTOMER_DONATION where EMAIL=" + req.params.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/c_feedback/:email", (req, res) => {
  connection
    .get_data("select * from FEEDBACK_VIEW where EMAIL=" + req.params.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/customer_price/:email", (req, res) => {
  connection
    .get_data(
      "select  * from  CUSTOMER_PRICING where CUSTOMER_ID =(select CUSTOMER_ID from CUSTOMER where EMAIL=" +
        req.params.email +
        ")"
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

//staff dashboard

app.get("staff_find_cabin/:ID", (req, res) => {
  connection
    .get_data(
      "select unique ('Customer Name'), 'Duration', 'Daycare Animal ID', CUSTOMER_ANIMAL_CABIN.cabin_no from CUSTOMER_ANIMAL_CABIN,DAYCARE_ANIMALwhere upper(type)=(select upper(SPECIALIZATION) from STAFF where EMAIL=(select email from login where serial= (select max(serial) from LOGIN))) and CUSTOMER_ANIMAL_CABIN.customer_id=" +
        req.params.ID
    )
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(port);
