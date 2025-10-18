package com.sitigroup.backend.partner;

import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PartnerInquiryRepository extends MongoRepository<PartnerInquiry, String> {
    Page<PartnerInquiry> findByStatus(PartnerInquiry.Status status, Pageable pageable);
}