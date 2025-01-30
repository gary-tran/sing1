package com.example.cpld.repository;

import com.example.cpld.model.Romanizations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RomanizationsRepository extends JpaRepository<Romanizations, UUID> {

}
