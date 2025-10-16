package com.sitigroup.backend.partner;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PartnerInquiryRepository extends MongoRepository<PartnerInquiry, String> {
    Page<PartnerInquiry> findByStatus(PartnerInquiry.Status status, Pageable pageable);
}

