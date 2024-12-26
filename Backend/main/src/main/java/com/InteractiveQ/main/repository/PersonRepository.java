package com.InteractiveQ.main.repository;

import com.InteractiveQ.main.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, String> {
    // Additional query methods, if needed
    Optional<Person> findByUserId(String userId);
}

