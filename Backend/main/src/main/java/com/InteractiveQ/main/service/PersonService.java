package com.InteractiveQ.main.service;

import com.InteractiveQ.main.entities.Person;
import com.InteractiveQ.main.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PersonService {

    @Autowired
    PersonRepository personRepository;


    public Optional<Person> getUserByUserId(String userId){
        return personRepository.findByUserId(userId);
    }

}
