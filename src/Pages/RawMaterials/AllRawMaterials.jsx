import React, { useEffect, useCallback, useState } from 'react';
import InventoryRawmaterials from '../../Components/InventoryRawMaterials/InventoryRawmaterials';
import SpecificItems from '../../Components/SpecificItems/SpecificItems';
import axios from 'axios';

const AllRawMaterials = () => {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState({});
    const [specific, setSpecific] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchInventory = async (controller) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/inventory/overallinventoryProducts/${userInfo.orgid}`,
                { signal: controller.signal }
            );
            console.log(response,"RESPONSE")
            setData(response.data.data);
        } catch (err) {
            if (!axios.isCancel(err)) console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSpecific = async (controller) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/inventory/getItemDetails/${selected.itemid}/${selected.catid}/${userInfo.orgid}/${selected.states}`,
                { signal: controller.signal }
            );
            setSpecific(response.data.data);
        } catch (err) {
            if (!axios.isCancel(err)) console.error(err);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchInventory(controller);
        return () => controller.abort();
    }, []);

    useEffect(() => {
        console.log(selected,"SELECTED")
        if (selected.itemid && selected.catid) {
            const controller = new AbortController();
            fetchSpecific(controller);
            return () => controller.abort();
        }
    }, [selected]);

    const setSelectedItem = useCallback((item) => {
        setSelected(item);
    }, []);

    useEffect(() => {
        console.log(data,"DAT|TATATA")
        console.log(selected,"SELECTED123")
    },[data])

    return (
        <div className="flex gap-3">
            <InventoryRawmaterials data={data} setSelected={setSelectedItem} />
            <SpecificItems specific={specific} />
        </div>
    );
};

export default AllRawMaterials;
