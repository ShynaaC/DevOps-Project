package com.example.companyintranet.controller;

import com.example.companyintranet.model.Policy;
import com.example.companyintranet.service.PolicyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policy")
@CrossOrigin
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    public List<Policy> getPolicies() {
        return policyService.getAllPolicies();
    }

    @PostMapping
    public Policy addPolicy(@RequestBody Policy policy) {
        return policyService.addPolicy(policy);
    }
}
