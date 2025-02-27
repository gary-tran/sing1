package com.cpld.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cpld.model.Romanizations;

import java.util.UUID;

@Repository
public interface RomanizationsRepository extends JpaRepository<Romanizations, UUID> {

}
